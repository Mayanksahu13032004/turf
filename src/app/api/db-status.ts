import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = await connectToDatabase();

    if (db.readyState === 1) {
      return res.status(200).json({ status: "✅ MongoDB is connected" });
    } else {
      return res.status(500).json({ status: "⚠️ MongoDB not connected" });
    }
  } catch (error) {
    return res.status(500).json({ status: "❌ Connection failed", error });
  }
}
