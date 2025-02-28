import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Order from "@/app/model/order";

interface Params {
    params: { id: string }
}

export async function GET(req: NextRequest, { params }: Params) {
    await connectToDatabase();
    try {

        const id = params.id;
        const result = await Order.find()
            .populate("turf_id")
            .then((orders) =>
                orders.filter(order => order.turf_id?.createdBy?.toString() === id)
            );

        //  const result = await Order.find()
        // .populate({
        //     path: "turf_id",
        //     match: { createdBy: id } // Filters orders where turf_id.createdBy matches adminId
        // });

        console.log("ordeterr for admin", result)
        return NextResponse.json({ message: "Order of all user of same admin", result }, { status: 200 })
    }
    catch (error) {
        console.error("Error processing order:");
        return NextResponse.json({ error: "Not fetch the users order" }, { status: 500 });
    }

}