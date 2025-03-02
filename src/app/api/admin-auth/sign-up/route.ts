import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Admin from "@/app/model/admin";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import { sendVerificationEmail } from "../../../lib/mailer";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  await connectToDatabase(); // Connect to MongoDB

  try {
    const payload = await req.json();
    console.log("Payload:", payload); // Log incoming request payload

    // Validate required fields
    if (!payload.name || !payload.email || !payload.password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: payload.email });
    if (existingAdmin) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 400 });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create new admin
    const newAdmin = new Admin({
      name: payload.name,
      email: payload.email,
      password: hashedPassword, // Store hashed password
      verified: false,
      verificationToken,
    });

    await newAdmin.save();

    await sendVerificationEmail(payload.email, verificationToken,"-adm");
    return NextResponse.json(
      { message: "Admin registered successfully", admin: { name: newAdmin.name, email: newAdmin.email } }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during admin signup:", error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
