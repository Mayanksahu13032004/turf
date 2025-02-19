import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import User from "../../../model/user";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    console.log("📢 POST /api/auth/signup - Registering new user");

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    return NextResponse.json({ message: "User registered successfully", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    return NextResponse.json({ error: "Error registering user" }, { status: 500 });
  }
}
