import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Admin from "@/app/model/admin";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  try {
    const { email, password } = await req.json();
    console.log("Emial",email);
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Validate Password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful", adminId: admin._id }, { status: 200 });
  } catch (error) {
    console.error("❌ Login Error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
