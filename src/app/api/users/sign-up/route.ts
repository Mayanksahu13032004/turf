import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectToDatabase } from "@/app/lib/mongodb";
import User from "../../../model/user";
import { sendVerificationEmail } from "../../../lib/mailer";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { name, email, password, referredBy } = await req.json(); // ✅ include referrer if sent

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create new user with referral info
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verified: false,
      verificationToken,
      referredBy: referredBy || null, // ✅ store referrer if exists
    });

    await newUser.save();

    // ✅ Credit ₹10 to the new user's wallet
    await fetch(`http://localhost:3000/api/wallet/${newUser._id}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "credit",
        amount: 10,
        description: "Welcome Bonus for Signing Up 🎉",
      }),
    });

    // ✅ Credit ₹50 to referrer if exists
    if (referredBy) {
      await fetch(`http://localhost:3000/api/wallet/${referredBy}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "credit",
          amount: 50,
          description: "Referral Reward 🎁",
        }),
      });
    }

    // ✅ Send verification email
    await sendVerificationEmail(email, verificationToken, "-user");

    return NextResponse.json(
      { message: "User registered! Please check your email for verification." },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error registering user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
