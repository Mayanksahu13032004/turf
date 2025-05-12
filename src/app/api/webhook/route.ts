import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";
// import connectToDatabase from "@/lib/db";
import { connectToDatabase } from "@/app/lib/mongodb";
// import Order from "@/models/Order?"; // Adjust path to your model
import Order from "@/app/model/order";

export const config = {
  api: {
    bodyParser: false, // Required for Stripe
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia" as const,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     await connectToDatabase();
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.error("❌ Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const {
        prompt,
        price,
        date,
        startTime,
        endTime,
        turf_id,
        user_id,
      } = session.metadata!;

      try {
        await connectToDatabase();

        const newOrder = new Order({
          prompt,
          price: parseFloat(price),
          date,
          startTime,
          endTime,
          turf_id,
          user_id,
          paymentStatus: "completed",
          stripeSessionId: session.id,
        });

        await newOrder.save();
        console.log("✅ Booking saved in database");
      } catch (err) {
        console.error("❌ Failed to save booking:", err);
        return res.status(500).send("Server error");
      }
    }

    res.status(200).send("✅ Webhook received");
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
