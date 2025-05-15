import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia" as const,
});


export async function POST(req: Request) {
  try {
    const { userId, amount } = await req.json();

    if (!userId || !amount) {
      return NextResponse.json({ error: "Missing userId or amount" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Add Money to Wallet",
            },
            unit_amount: amount * 100, // Convert ₹ to paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/wallet/success?userId=${userId}&amount=${amount}`,
      cancel_url: `${baseUrl}/wallet`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: "Stripe Error" }, { status: 500 });
  }
}
