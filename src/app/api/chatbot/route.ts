import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    const match = prompt.match(/Book (.+?) on (\d{4}-\d{2}-\d{2}) at ([\d:]+ ?[APMapm]{2}) - ([\d:]+ ?[APMapm]{2})/);
    if (!match) return NextResponse.json({ error: "Invalid prompt format" }, { status: 400 });

    const [_, turfName, date, startTime, endTime] = match;

    const allTurfRes = await axios.get("http://localhost:3000/api/users/allturf");
    const turfs = allTurfRes.data?.turfs;

    if (!Array.isArray(turfs)) {
      return NextResponse.json({ error: "Invalid turf data structure" }, { status: 500 });
    }

    const turf = turfs.find((t: any) => t.name.toLowerCase() === turfName.toLowerCase());
    if (!turf) return NextResponse.json({ error: "Turf not found" }, { status: 404 });

    const orderDatacheck = { date, startTime, endTime };
    const checkRes = await axios.post(
      `http://localhost:3000/api/users/exploreturf/${turf._id}/check`,
      orderDatacheck,
      { headers: { "Content-Type": "application/json" } }
    );

    if (checkRes.status !== 201) {
      return NextResponse.json({ error: "Time slot unavailable" }, { status: 409 });
    }

    const stripeSession = await axios.post("http://localhost:3000/api/payment", {
      metadata: {
        prompt,
        price: turf.price,
        date,
        startTime,
        endTime,
        turf_id: turf._id,
        user_id: ""
      }
    });

    return NextResponse.json({
      message: "Turf available, redirecting to payment",
      sessionUrl: stripeSession.data.sessionUrl
    });

  } catch (err: any) {
    console.error("Booking error:", err.message || err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
