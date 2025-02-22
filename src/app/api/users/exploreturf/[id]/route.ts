import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Turf from "@/app/model/turf";
import Order from "@/app/model/order";

interface Params {
    params: { id: string };
}

// ✅ Optimized GET method to fetch Turf data
export async function GET(req: NextRequest, { params }: Params) {
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
        console.error("Error fetching turf data:", error);
        return NextResponse.json({ error: "Failed to fetch turf data" }, { status: 500 });
    }
}

// ✅ Optimized POST method to create a Turf order
export async function POST(req: NextRequest, { params }: Params) {
    try {
        await connectToDatabase();

        // Parse request body
        const {
            user_id,
            date,
            startTime,
            endTime,
            price,
            paymentStatus,
            transactionId,
            status,
        } = await req.json();

        // Validate required fields
        if (!user_id || !date || !startTime || !endTime || !price) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Extract Turf ID from params
        const turf_id = params.id;
        console.log("Order Turf ID:", turf_id);
        console.log("Order User ID:", user_id);

        // Create a new order
        const newOrder = new Order({
            user_id,
            turf_id,
            date,
            startTime,
            endTime,
            price,
            paymentStatus,
            transactionId,
            status,
        });

        // Save the order
        await newOrder.save();

        return NextResponse.json(
            { message: "Turf order placed successfully", result: newOrder },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error processing order:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
