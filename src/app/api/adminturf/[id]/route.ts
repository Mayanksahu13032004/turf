import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Turf from "@/app/model/turf";
import mongoose from "mongoose";
import fs from "fs";
import os from "os"; // For temp directory
import path from "path";
import cloudinary from "@/app/lib/cloudinary";

interface Params {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: Params) {
  await connectToDatabase();

  try {
    // Ensure request is multipart/form-data
    if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid content type, expected form-data" }, { status: 400 });
    }

    // Parse FormData from request
    const formData = await req.formData();

    // Extract turf details
    const name = formData.get("name") as string | null;
    const location = formData.get("location") as string | null;
    const pricePerHour = formData.get("pricePerHour") ? Number(formData.get("pricePerHour")) : null;
    const size = formData.get("size") as string | null;
    const surfaceType = formData.get("surfaceType") as string | null;

    const amenities = formData.getAll("amenities").map(String); // Convert to array of strings
    // Convert formData values correctly
    const availabilityArray: { day: string; startTime: string; endTime: string }[] = [];
    const availabilityRaw = formData.getAll("availability") as string[];
    
    availabilityRaw.forEach((entry) => {
      const parts = entry.split(" "); // Example input: "Monday 8AM-10PM"
      
      if (parts.length !== 2) {
        throw new Error("Invalid availability format. Expected 'Day StartTime-EndTime'.");
      }
    
      const [day, timeRange] = parts;
      const [startTime, endTime] = timeRange.split("-");
    
      if (!day || !startTime || !endTime) {
        throw new Error("Missing required availability fields.");
      }
    
      availabilityArray.push({ day, startTime, endTime });
    });
    

    const adminId = params.id; // Extract from URL

    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return NextResponse.json({ error: "Invalid admin ID" }, { status: 400 });
    }

    console.log("📢 Admin ID:", adminId);

    const imagecloud=process.env.CLOUDINARY_CLOUD_NAME as string;
    console.log("image cloud",imagecloud);
    

    // Validate required fields
    // if (!name || !location || !pricePerHour || !size || !surfaceType) {
    //   return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    // }

    // Process multiple images
    const images: string[] = [];

    for (const [key, value] of formData.entries()) {
      if (key.startsWith("images") && value instanceof Blob) {
        // Convert Blob to Buffer
        const buffer = Buffer.from(await value.arrayBuffer());
        
        // Create a temp file path
        const tempFilePath = path.join(os.tmpdir(), `${crypto.randomUUID()}.jpg`);
        await fs.promises.writeFile(tempFilePath, buffer);

        try {
          // Upload to Cloudinary
          const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
            folder: "turf-images",
          });

          // Store image URL in array
          images.push(uploadResult.secure_url);
        } catch (uploadError) {
          console.error("Cloudinary upload failed:", uploadError);
          return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
        } finally {
          // Delete temporary file
          await fs.promises.unlink(tempFilePath);
        }
      }
    }

    console.log("📢 Uploaded Images:", images);

    // Create Turf entry
    const newTurf = new Turf({
      name,
      location,
      pricePerHour,
      size,
      surfaceType,
      amenities,
      availability: availabilityArray, // Correct format
      createdBy: new mongoose.Types.ObjectId(adminId),
      images, // Store Cloudinary URLs
    });

    await newTurf.save();

    return NextResponse.json(
      { message: "Turf registered successfully", result: newTurf },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during Turf Registration:", error);
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