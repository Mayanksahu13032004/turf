import { connectToDatabase } from "@/app/lib/mongodb";
import Turf from "@/app/model/turf";
import mongoose from "mongoose";
import { NextResponse ,NextRequest} from "next/server";

export async function GET(req: NextRequest) {
    await connectToDatabase();
    try {
        
const result=await Turf.find();

return NextResponse.json({message:"All Turf",result},{status:201});


    } catch (error) {
        console.error("All turf are load to failed:", error);
        return NextResponse.json({ error: "All turf are load to failed" }, { status: 500 });
    }
}
