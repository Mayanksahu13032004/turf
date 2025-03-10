import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Order from "@/app/model/order";
import Turf from "@/app/model/turf";

export async function GET() {
    await connectToDatabase();

    try {
        // Get all orders
        const orders = await Order.find().populate("turf_id");

        // Update dynamic pricing based on bookings
        const updatedOrders = await Promise.all(
            orders.map(async (order) => {
                const turf = order.turf_id;

                if (!turf) return order; // Skip if no turf is found

                // Count total bookings for this turf
                const bookingCount = await Order.countDocuments({ turf_id: turf._id });
                console.log(`Turf: ${turf.name}, Bookings: ${bookingCount}`);


                // Apply 50% discount if no bookings exist
                if (bookingCount === 0) {
                    turf.dynamicPricePerHour = turf.pricePerHour * 0.5;
                } else {
                    // Fetch dynamic pricing from Flask API
                    const response = await fetch("http://127.0.0.1:5000/predict-price", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ base_price: turf.pricePerHour }),
                    });

                    const data = await response.json();
                    if (response.ok) {
                        turf.dynamicPricePerHour = data.dynamic_price;
                    }
                }

                await turf.save(); // Save updated dynamic price
                return order;
            })
        );

        console.log("All orders with updated pricing", updatedOrders);

        return NextResponse.json({ message: "Orders fetched successfully", updatedOrders }, { status: 200 });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
