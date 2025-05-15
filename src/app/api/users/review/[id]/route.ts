// src/app/api/users/review/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Review from "@/app/model/Review";

interface Params {
    params: { id: string }; // Turf ID
}

// ✅ GET: Fetch all reviews for a turf
export async function GET(req: NextRequest, { params }: Params) {
    await connectToDatabase();

    try {
        const turfId = params.id;
        console.log("Fetching reviews for turfId:", turfId);

        const reviews = await Review.find({ turfId });

        return NextResponse.json({ success: true, reviews }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}

// ✅ POST: Create a new review
export async function POST(req: NextRequest, { params }: Params) {
    await connectToDatabase();

    try {
        const { userId, rating, comment } = await req.json();
        const turfId = params.id;

        if (!userId || !turfId || !rating || !comment) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newReview = new Review({ userId, turfId, rating, comment });
        await newReview.save();

        return NextResponse.json(
            { message: "Review added successfully", review: newReview },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}
