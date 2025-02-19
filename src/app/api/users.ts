import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../lib/mongodb";
import User, { IUser } from "../model/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "GET") {
    const users: IUser[] = await User.find({});
    return res.status(200).json(users);
  }

  if (req.method === "POST") {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newUser = new User({ name, email, password });
      await newUser.save();

      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json({ error: "Error creating user" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
