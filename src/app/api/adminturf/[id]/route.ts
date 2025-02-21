import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Turf from "@/app/model/turf";
import mongoose from "mongoose";

interface Params {
    params: { id: string }; // Extracts the `id` from the dynamic route
}

export async function POST(req: NextRequest, { params }: Params) {
    await connectToDatabase();

    try {
        if (!req.headers.get("content-type")?.includes("application/json")) {
            return NextResponse.json({ error: "Invalid content type, expected JSON" }, { status: 400 });
        }

        const payload = await req.json();
        console.log("📢 Received Turf Data:", payload);

        // Extract admin ID from the dynamic route (URL)
        const adminId = params.id;

        if (!mongoose.Types.ObjectId.isValid(adminId)) {
            return NextResponse.json({ error: "Invalid admin ID" }, { status: 400 });
        }

        console.log("📢 Admin ID (Created By):", adminId);

        // Create a new Turf entry with the extracted admin ID
        const newTurf = new Turf({
            name: payload.name,
            location: payload.location,
            pricePerHour: payload.pricePerHour,
            size: payload.size,
            surfaceType: payload.surfaceType,
            amenities: payload.amenities,
            availability: payload.availability,
            createdBy: new mongoose.Types.ObjectId(adminId), // Set admin ID dynamically
            images: payload.images
        });

        await newTurf.save();

        return NextResponse.json(
            { message: " Turf registered successfully", result: newTurf },
            { status: 201 }
        );

    } catch (error) {
        console.error(" Error during Turf Registration:", error);
        return NextResponse.json({ error: "Turf registration failed" }, { status: 500 });
    }
}



export async function GET(req:NextRequest,{params}:Params) {
    await connectToDatabase();
    try {
        

            const id=params.id;
            const result=await Turf.find({createdBy:id});

return NextResponse.json({message:"Allturf of admin",result},{status:201});

    } catch (error) {
        console.error(" Error during get turf by admin:", error);
        return NextResponse.json({ error: "Error during get turf by admin:" }, { status: 500 });
    }
    
}