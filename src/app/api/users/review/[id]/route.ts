import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Review from "@/app/model/Review";


interface Params {
    params: { id: string }; // Turf ID
}

// ✅ Fetch all reviews for a specific turf
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await connectToDatabase();

    try {
        const turfId = params.id;
console.log("turf id",turfId);

        // Fetch reviews with user details (only fetching 'name' field)
        const reviews = await Review.find({ turfId })

        return NextResponse.json({ success: true, reviews }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}


// ✅ Post a new review
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

        return NextResponse.json({ message: "Review added successfully", review: newReview }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}
