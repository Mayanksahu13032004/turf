import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Turf from "@/app/model/turf";
import Order from "@/app/model/order";
// import Order from "@/app/model/order";

interface Params {
    params: { id: string };
}

// ✅ Optimized GET method to fetch Turf data
export async function GET(req: NextRequest, { params }: Params) {
    // Data base connection
    await connectToDatabase();

    try {
        const turfID = params.id;
        console.log("Turf ID:", turfID);

        const result = await Turf.findById(turfID);
        if (!result) {
            return NextResponse.json({ error: "Turf not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Turf data fetched successfully", result }, { status: 200 });

    } catch (error) {
        console.error("Error fetching turf data-", error);
        return NextResponse.json({ error: "Failed to fetch turf data" }, { status: 500 });
    }
}



export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();

        const { id: turf_id } = params || {};
        if (!turf_id) {
            return NextResponse.json({ error: "Invalid Turf ID" }, { status: 400 });
        }

        const body = await req.json();
        const { user_id, date, startTime, endTime, price, paymentStatus, transactionId } = body;

        if (!user_id || !date || !startTime || !endTime || !price) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }



        const newOrder = new Order({
            user_id,
            turf_id,
            date,
            startTime,
            endTime,
            price,
            paymentStatus,
            transactionId,
        });

        const result = await newOrder.save();

        return NextResponse.json(
            { message: "Turf order placed successfully", result: newOrder },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}















