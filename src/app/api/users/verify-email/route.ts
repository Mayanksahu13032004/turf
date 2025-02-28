import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb"; // Ensure you have a database connection utility
import User from "../../../model/user";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase(); // Connect to MongoDB

    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ message: "Token is required." }, { status: 400 });
    }

    // Find user with matching verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token." }, { status: 400 });
    }

    // Update user to mark as verified
    user.verified = true;
    user.verificationToken = undefined; // Remove token after use
    await user.save();

    return NextResponse.json({ message: "Email verified successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
