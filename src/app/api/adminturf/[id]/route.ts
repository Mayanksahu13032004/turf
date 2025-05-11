import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Turf from "@/app/model/turf";
import mongoose from "mongoose";
import fs from "fs";
import os from "os";
import path from "path";
import crypto from "crypto";
import cloudinary from "@/app/lib/cloudinary";

interface Params {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: Params) {
  await connectToDatabase();

  try {
    // Validate Content-Type
    if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
    }

    const formData = await req.formData();

    const name = formData.get("name") as string | null;
    const location = formData.get("location") as string | null;
    const pricePerHour = formData.get("pricePerHour") ? Number(formData.get("pricePerHour")) : null;
    const size = formData.get("size") as string | null;
    const surfaceType = formData.get("surfaceType") as string | null;
    const amenities = formData.getAll("amenities").map(String);

    const adminId = params.id;
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return NextResponse.json({ error: "Invalid admin ID" }, { status: 400 });
    }

    // Validate required fields
    if (!name || !location || !pricePerHour || !size || !surfaceType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Parse availability
    const availabilityArray: { day: string; startTime: string; endTime: string }[] = [];
    const availabilityRaw = formData.getAll("availability") as string[];
    for (const entry of availabilityRaw) {
      const [day, range] = entry.split(" ");
      const [startTime, endTime] = range?.split("-") ?? [];
      if (!day || !startTime || !endTime) {
        return NextResponse.json({ error: "Invalid availability format" }, { status: 400 });
      }
      availabilityArray.push({ day, startTime, endTime });
    }

    // Upload images to Cloudinary
    const images: string[] = [];

    for (const [key, value] of formData.entries()) {
      if (key === "images" && value instanceof Blob) {
        const buffer = Buffer.from(await value.arrayBuffer());
        const tempPath = path.join(os.tmpdir(), `${crypto.randomUUID()}.jpg`);
        await fs.promises.writeFile(tempPath, buffer);

        try {
          const uploadResult = await cloudinary.uploader.upload(tempPath, {
            folder: "turf-images",
          });
          images.push(uploadResult.secure_url);
        } catch (err) {
          console.error("Image upload failed:", err);
          return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
        } finally {
          await fs.promises.unlink(tempPath);
        }
      }
    }

    // Save to MongoDB
    const newTurf = new Turf({
      name,
      location,
      pricePerHour,
      size,
      surfaceType,
      amenities,
      availability: availabilityArray,
      createdBy: new mongoose.Types.ObjectId(adminId),
      images,
    });

    await newTurf.save();

    return NextResponse.json(
      { message: "Turf registered successfully", result: newTurf },
      { status: 201 }
    );
  } catch (error) {
    console.error("Turf registration error:", error);
    return NextResponse.json({ error: "Turf registration failed" }, { status: 500 });
  }
}










export async function GET(req: NextRequest, { params }: Params) {
  await connectToDatabase();
  try {


    const id = params.id;
    const result = await Turf.find({ createdBy: id });

    return NextResponse.json({ message: "Allturf of admin", result }, { status: 201 });

  } catch (error) {
    console.error(" Error during get turf by admin:", error);
    return NextResponse.json({ error: "Error during get turf by admin:" }, { status: 500 });
  }

}


