import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

// ✅ Correct structure for dynamic route handler
export async function GET(
  req: Request,
  context: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = context.params;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required." }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({ session });
  } catch (err: any) {
    console.error("❌ Stripe session fetch failed:", err.message || err);
    return NextResponse.json(
      { error: "Failed to fetch Stripe session." },
      { status: 500 }
    );
  }
}
