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





export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();

        // Extract Turf ID from params
        const { id: turf_id } = params || {};
        if (!turf_id) {
            return NextResponse.json({ error: "Invalid Turf ID" }, { status: 400 });
        }

        // Parse request body
        const body = await req.json();
        console.log("Request Body:", body);

        const { user_id, date, startTime, endTime, price, paymentStatus, transactionId } = body;

        // Validate required fields
        if (!user_id || !date || !startTime || !endTime || !price) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Find the turf in the database
        const adminTurf = await Turf.findById(turf_id);
        if (!adminTurf) {
            console.error(`Turf not found: ${turf_id}`);
            return NextResponse.json({ error: "Turf not found" }, { status: 404 });
        }

        console.log("Order Turf ID:", turf_id);
        console.log("Order User ID:", user_id);
        console.log("Admin ID for Order:", adminTurf.createdBy);

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
        });

        // Save the order
        const result = await newOrder.save();
        console.log("Order saved successfully:", result);
let success=false;
if(result){
    success=true;
}

        return NextResponse.json(
            { message: "Turf order placed successfully", result: newOrder, adminId: adminTurf.createdBy,success },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error processing order:", error.message || error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}

