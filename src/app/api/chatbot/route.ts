import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "../../lib/mongodb";
import Turf from "@/app/model/turf";
import Order from "@/app/model/order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia" as const,
});

// Dummy user ID for now (replace this with auth logic if available)
const dummyUserId = "663df32a35d190b6c4eeb4a0"; // Replace with real user ID

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
    console.log("prompt, price, startTime, endTime, turf_id, user_id", prompt, price, startTime, endTime, turf_id, user_id);

    const origin = process.env.NEXT_PUBLIC_BASE_URL;
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
console.log("chatbot detials",turfName,date,time);

    const turf = await Turf.findOne({ name: { $regex: new RegExp(`^${turfName}$`, "i") } });
    if (!turf) {
      return NextResponse.json({ response: `❌ No turf found with name "${turfName}".` });
    }

    // Convert start and end time to Date objects
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);

    // Check for overlapping bookings (existing bookings that overlap with new one)
   const existingBooking = await Order.findOne({date });
if (existingBooking) {
      return NextResponse.json({
        response: `❌ ${turf.name} is already booked on ${date} between ${startTime} and ${endTime}.`,
      });
    } else {
      // ✅ If no overlapping booking, proceed with the payment process
    const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [
    {
      price_data: {
        currency: "inr",
        product_data: {
          name: "Turf Booking",
        },
        unit_amount: price * 100, // ₹1 = 100 paise
      },
      quantity: 1,
    },
  ],
  mode: "payment",
  success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${origin}/cancel`,
  metadata: {
    prompt,
    price: price.toString(), // Stripe metadata values must be strings
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

    }

  } catch (err: any) {
    console.error("Booking error:", err.message || err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
