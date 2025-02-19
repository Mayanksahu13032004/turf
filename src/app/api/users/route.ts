import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/mongodb";
import User, { IUser } from "../../model/user";

// Handle GET request
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    console.log("📢 GET /api/users - Fetching users");

    const users: IUser[] = await User.find({});
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}

// Handle POST request
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    console.log("📢 POST /api/users - Creating new user");

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
