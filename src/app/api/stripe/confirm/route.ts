import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import Order from "@/app/model/order";
import { connectToDatabase } from "@/app/lib/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-02-24.acacia',});

export async function POST(req: NextRequest) {
  await connectToDatabase();
  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "No session ID provided" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    const order = new Order({
      user_id: session.metadata?.user_id,
      turf_id: session.metadata?.turf_id,
      date: session.metadata?.date,
      startTime: session.metadata?.startTime,
      endTime: session.metadata?.endTime,
      price: session.amount_total ? session.amount_total / 100 : 0,

      paymentStatus: "completed",
      transactionId: session.payment_intent,
    });

    await order.save();

    return NextResponse.json({ message: "Payment confirmed and order saved", order }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
