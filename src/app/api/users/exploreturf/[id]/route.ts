import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import mongoose from "mongoose";
import Turf from "@/app/model/turf";

interface Params{
    
    params:{id:string};
}

export async function GET(req:NextRequest,{params}:Params) {
    await connectToDatabase();
    try {
    
        const turfID= params.id;
console.log("Turf id is",turfID);

        const result=await Turf.findById(turfID);

        return NextResponse.json({message:"Turf data is successfully.",result},{status:201})



    }
    
    
    
    catch (error) {
        console.error(" Turf data failed :", error);
        return NextResponse.json({ error: "Turf data fetch failed" }, { status: 500 });
    }
}

