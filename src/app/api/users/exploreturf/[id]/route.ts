import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import mongoose from "mongoose";
import Turf from "@/app/model/turf";
import Order from "@/app/model/order";

interface Params {

    params: { id: string };
}

export async function GET(req: NextRequest, { params }: Params) {
    await connectToDatabase();
    try {

        const turfID = params.id;
        console.log("Turf id is", turfID);

        const result = await Turf.findById(turfID);

        return NextResponse.json({ message: "Turf data is successfully.", result }, { status: 201 })
    }
    catch (error) {
        console.error(" Turf data failed :", error);
        return NextResponse.json({ error: "Turf data fetch failed" }, { status: 500 });
    }
}


// make a order turf

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Parse request body
        const { 
            user_id, 
            turf_id, 
            date, 
            startTime, 
            endTime, 
            price, 
            paymentStatus, 
            transactionId, 
            status 
        } = await req.json();

        // Validate required fields
        if (!user_id || !date || !startTime || !endTime || !price) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Extract Turf ID from params
        const id = params.id;
        console.log("Order Turf ID:", id);
        console.log("Order User ID:", user_id);

        // Create a new order
        const result = await Order.create({
            user_id,
            turf_id: id,
            date,
            startTime,
            endTime,
            price,
            paymentStatus,
            transactionId,
            status,
        });

        await result.save();

        return NextResponse.json(
            { message: "Turf order is successful", result },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error processing order:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
