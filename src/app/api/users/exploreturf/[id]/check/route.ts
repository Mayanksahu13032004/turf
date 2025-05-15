import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Turf from "@/app/model/turf";
import Order from "@/app/model/order";
// import Order from "@/app/model/order";
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();

        const { id: turf_id } = params || {};
        if (!turf_id) {
            return NextResponse.json({ error: "Invalid Turf ID" }, { status: 400 });
        }

        const body = await req.json();
        const {  date, startTime, endTime} = body;

        if (  !date || !startTime || !endTime ) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if the slot is already booked
        const existingBooking = await Order.findOne({ turf_id, date, startTime, endTime });
        if (existingBooking) {
            return NextResponse.json({ error: "This time slot is already booked. Please select another slot." }, { status: 409 });
        }

        

       

        return NextResponse.json(
            { message: "turf is available" },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}