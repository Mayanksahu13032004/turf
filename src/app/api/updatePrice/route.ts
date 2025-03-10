import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Order from "@/app/model/order";
import Turf from "@/app/model/turf";

export async function GET() {
    await connectToDatabase();

    try {
        // Get all turfs
        const turfs = await Turf.find();
        console.log("Total Turfs:", turfs.length);

        for (const turf of turfs) {
            const bookingCount = await Order.countDocuments({ turf_id: turf._id });

            if (bookingCount === 0) {
                // Ensure 50% discount is PERMANENT for unbooked turfs
                if (turf.dynamicPricePerHour !== turf.pricePerHour * 0.5) {
                    turf.dynamicPricePerHour = turf.pricePerHour * 0.5;
                    await turf.save();
                    console.log(`No bookings for ${turf.name}, permanently applying 50% discount.`);
                }
            } else {
                // Fetch dynamic price from Flask API ONLY for booked turfs
                const response = await fetch("http://127.0.0.1:5000/predict-price", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ base_price: turf.pricePerHour }),
                });

                const data = await response.json();
                if (response.ok) {
                    turf.dynamicPricePerHour = data.dynamic_price;
                    await turf.save();
                    console.log(`Updated dynamic price for ${turf.name}: ${data.dynamic_price}`);
                }
            }
        }

        return NextResponse.json({ message: "Dynamic pricing updated for all turfs" }, { status: 200 });

    } catch (error) {
        console.error("Error updating turfs:", error);
        return NextResponse.json({ error: "Failed to update turfs" }, { status: 500 });
    }
}
