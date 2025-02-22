import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Admin from "@/app/model/admin";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 400 });
    }

    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();

    return NextResponse.json({ message: "Admin registered successfully" }, { status: 201 });
  } catch (error) {
    console.log("error is", error)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
