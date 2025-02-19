import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import User from "../../../model/user";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    console.log("📢 POST /api/auth/login - Logging in user");

    const { email, password } = await req.json();
console.log("emil",email);

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Validate password
 

    return NextResponse.json({ message: "Login successful", user }, { status: 200 });
  } catch (error) {
    console.error("❌ Login Error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
