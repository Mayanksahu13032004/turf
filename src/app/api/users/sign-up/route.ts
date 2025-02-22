import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import User from "../../../model/user";
import { sendEmail } from "../../../lib/mailer";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    console.log(" POST /api/auth/signup - Registering new user");

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Create and save the user
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Send confirmation email
    const emailSent = await sendEmail(
      email,
      "Welcome to Turf!",
      `Hello ${name},\n\nWelcome to Turf and Enjoy. Your account has been successfully created!`,
      `<p>Hello <strong>${name}</strong>,</p><p>Welcome to <strong>Turf and Enjoyk</strong>. Your account has been successfully created!</p>`
    );

    if (!emailSent) {
      console.warn(" User registered but email not sent.");
    }

    return NextResponse.json({ message: "User registered successfully", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    return NextResponse.json({ error: "Error registering user" }, { status: 500 });
  }
}
