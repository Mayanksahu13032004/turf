import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "../../lib/mongodb";
import Turf from "@/app/model/turf";
import Order from "@/app/model/order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia" as const,
});

function calculateEndTime(startTime: string) {
  const match = startTime.match(/(\d{1,2})(:(\d{2}))?\s?(AM|PM)/i);
  if (!match) return startTime;

  let hour = parseInt(match[1]);
  const minutes = match[3] || "00";
  const period = match[4].toUpperCase();

  hour = (hour % 12) + 1; // Add 1 hour
  const newPeriod = hour === 12 ? (period === "AM" ? "PM" : "AM") : period;

  return `${hour}:${minutes} ${newPeriod}`;
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { prompt, price, startTime, endTime, turf_id, user_id } = await req.json();

    const origin = process.env.NEXT_PUBLIC_BASE_URL;

    // --- Greeting ---
    if (/^(hi|hello|hey)$/i.test(prompt.trim())) {
      return NextResponse.json({ response: "👋 Hello! How can I help you with turf bookings today?" });
    }

// Price based pridiction
const priceMatch = prompt.match(/price\s*(less|below|under)?\s*(\d+)/i);
if (priceMatch) {
  const priceLimit = parseInt(priceMatch[2]);

  // Find turfs with price less than or equal to the given limit
  const affordableTurfs = await Turf.find({ price: { $lt: priceLimit } });

  if (affordableTurfs.length === 0) {
    return NextResponse.json({
      response: `❌ No turfs found below ₹${priceLimit}.`,
    });
  }

  return NextResponse.json({
    response: `✅ Turfs available below ₹${priceLimit}: ${affordableTurfs
      .map((t) => `${t.name} (₹${t.price})`)
      .join(", ")}`,
  });
}



    // --- Find turf in a location ---
    const locationMatch = prompt.match(/turf.+in\s(.+)/i);
    if (locationMatch) {
      const location = locationMatch[1].trim();
      const turfs = await Turf.find({
        location: { $regex: new RegExp(location, "i") },
      });

      if (turfs.length === 0) {
        return NextResponse.json({ response: `❌ No turfs found in ${location}.` });
      }

      return NextResponse.json({
        response: `✅ Found turfs in ${location}: ${turfs.map((t) => t.name).join(", ")}`,
      });
    }

    // --- Check availability ---
    const availabilityMatch = prompt.match(/which turfs are available on\s(\d{4}-\d{2}-\d{2})\s+at\s+(\d{1,2}(:\d{2})?\s?(AM|PM))/i);
    if (availabilityMatch) {
      const date = availabilityMatch[1];
      const time = availabilityMatch[2];
      const turfs = await Turf.find({});
      const availableTurfs: string[] = [];

      for (const turf of turfs) {
        const existingOrder = await Order.findOne({
          turf_id: turf._id,
          date,
          startTime: time,
        });

        if (!existingOrder) {
          availableTurfs.push(turf.name);
        }
      }

      return NextResponse.json({
        response: availableTurfs.length > 0
          ? `✅ Available turfs at ${time} on ${date}: ${availableTurfs.join(", ")}`
          : `❌ No turfs available at ${time} on ${date}.`,
      });
    }

    // --- Booking logic ---
    const turfMatch = prompt.match(/book\s(.+?)\s+on/i);
    const dateMatch = prompt.match(/on\s(\d{4}-\d{2}-\d{2})/);
    const timeMatch = prompt.match(/at\s(\d{1,2}(:\d{2})?\s?(AM|PM|am|pm)?)/);

    const turfName = turfMatch?.[1]?.trim();
    const date = dateMatch?.[1];
    const time = timeMatch?.[1];

    if (!turfName || !date || !time) {
      return NextResponse.json({
        response: "❌ I couldn't understand the turf name, date, or time. Please try again.",
      });
    }

    const turf = await Turf.findOne({ name: { $regex: new RegExp(`^${turfName}$`, "i") } });
    if (!turf) {
      return NextResponse.json({ response: `❌ No turf found with name \"${turfName}\".` });
    }

    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);

    const existingBooking = await Order.findOne({ date });
    if (existingBooking) {
      return NextResponse.json({
        response: `❌ ${turf.name} is already booked on ${date} between ${startTime} and ${endTime}.`,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Turf Booking",
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        prompt,
        price: price.toString(),
        date,
        startTime,
        endTime,
        turf_id,
        user_id,
      },
    });

    return NextResponse.json({
      response: "✅ Slot is available! Redirecting to payment...",
      checkoutUrl: session.url,
    });

  } catch (err: any) {
    console.error("Booking error:", err.message || err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
