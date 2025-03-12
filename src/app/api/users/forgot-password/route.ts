import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { connectToDatabase } from "@/app/lib/mongodb"; // connect to your MongoDB
import User from "../../../model/user"; // your mongoose User model

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate reset token and expiry (1 hour)
    const token = crypto.randomUUID();
    const expiry = new Date(Date.now() + 3600000);

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password?token=${token}&email=${email}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Link",
      html: `
        <p>Hi,</p>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    return NextResponse.json({ message: "Reset link sent!" }, { status: 200 });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
