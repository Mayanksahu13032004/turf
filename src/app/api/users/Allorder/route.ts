import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Order from "@/app/model/order";
import Turf from "@/app/model/turf";



export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const user_id = params.id;
    console.log("user id for get all order", user_id);

    const result = await Order.find({ user_id }).populate("turf_id");
    console.log("result of the get", result);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return NextResponse.json({ message: "Failed to fetch bookings" }, { status: 500 });
  }
}
 