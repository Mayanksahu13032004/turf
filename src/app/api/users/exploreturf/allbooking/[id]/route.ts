import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Order from "@/app/model/order";
import user from "@/app/model/user";

interface Params {
    params: { id: string };
}

export async function GET(req: NextRequest, { params }: Params) {

    await connectToDatabase();

    try {

        const user_id = params.id;
        console.log("user id for get all order", user_id);

        const result = await Order.find({ user_id }).populate("turf_id");
        console.log("result of the get ", result);

        return NextResponse.json({ message: " Turf data fetched successfully", result }, { status: 200 });


    }
    catch (error) {
        console.error("Error processing order:");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}