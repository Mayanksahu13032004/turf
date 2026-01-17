import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectToDatabase } from "@/app/lib/mongodb";
import User from "../../../model/user";
import { sendVerificationEmail } from "../../../lib/mailer";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { name, email, password, referredBy } = await req.json();

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
      referredBy: referredBy || null,
    });

    await newUser.save();

    // ✅ Dynamic Base URL for Vercel vs Local Development
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // ✅ Credit ₹10 to the new user's wallet
    try {
      await fetch(`${baseUrl}/api/wallet/${newUser._id}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "credit",
          amount: 10,
          description: "Welcome Bonus for Signing Up 🎉",
        }),
      });
    } catch (walletErr) {
      console.error("⚠️ New user wallet credit failed:", walletErr);
    }

    // ✅ Credit ₹50 to referrer if exists
    if (referredBy) {
      try {
        await fetch(`${baseUrl}/api/wallet/${referredBy}/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "credit",
            amount: 50,
            description: "Referral Reward 🎁",
          }),
        });
      } catch (refErr) {
        console.error("⚠️ Referrer wallet credit failed:", refErr);
      }
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