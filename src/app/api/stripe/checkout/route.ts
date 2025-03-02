import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-02-24.acacia',});

export async function POST(req: NextRequest) {
  try {
    const { turf_id, user_id, price, date, startTime, endTime } = await req.json();

    // if (!turf_id || !user_id || !price || !date || !startTime || !endTime) {
    //   return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    // }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      customer_email: "customer@example.com",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Turf Booking" },
            unit_amount: price * 100, // Convert price to paise
          },
          quantity: 1,
        },
      ],
    });

    return NextResponse.json({ id: session.id }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
