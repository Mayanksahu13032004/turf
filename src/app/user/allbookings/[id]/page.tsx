"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Booking {
  _id: string;
  userId: string;
  startTime: string;
  endTime: string;
  date: string;
  paymentStatus:string;
  status: string;
  turf_id: { _id: string; name: string };
}

export default function TurfBookings() {
  const [turfBookings, setTurfBookings] = useState<Booking[]>([]);
  const params = useParams();

  useEffect(() => {
    const id = params.id as string;

    const fetchAllBookings = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/users/exploreturf/allbooking/${id}`
        );
        const data = await response.json();

console.log(data.result);

        if (response.ok) {
          setTurfBookings(data.result);
        } else {
          console.error("Error fetching bookings:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    if (id) {
      fetchAllBookings();
    }
  }, [params.id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-12 px-6">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 drop-shadow-lg">
        📋 Turf Bookings
      </h1>

      {/* Table Container */}
      <div className="max-w-8xl mx-auto overflow-hidden bg-white shadow-2xl rounded-lg border border-gray-200">
        <table className="min-w-full border-collapse">
          {/* Table Head */}
          <thead className="bg-gray-600 text-white">
            <tr>
              <th className="py-5 px-6 text-left text-2xl font-bold ">Booking ID</th>
              <th className="py-5 px-6 text-left font-bold text-2xl ">Turf Name</th>
              <th className="py-5 px-6 text-left font-bold text-2xl">📅 Date</th>
              <th className="py-5 px-6 text-left font-bold text-2xl">⏰ Time Slot</th>
              <th className="py-5 px-6 text-center font-bold text-2xl">Status</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-300 text-lg">
  {turfBookings.length > 0 ? (
    turfBookings.map((booking, index) => (
      <tr
        key={booking._id}
        className={`transition-all duration-200 hover:scale-[1.02] hover:bg-blue-50 ${
          index % 2 === 0 ? "bg-gray-100" : "bg-white"
        }`}
      >
        <td className="py-6 px-8 font-semibold text-gray-900">{booking._id}</td>
        <td className="py-6 px-8 text-gray-800 text-2xl font-extrabold">{booking.turf_id.name}</td>
        <td className="py-6 px-8 font-semibold text-gray-700 text-lg">{booking.date}</td>
        <td className="py-6 px-8 font-semibold text-gray-700 text-lg">
          {booking.startTime} - {booking.endTime}
        </td>
        <td className="py-6 px-8 text-center">
          <span
            className={`px-6 py-3 text-lg font-bold uppercase rounded-xl shadow-lg tracking-wide ${
              booking.paymentStatus === "completed"
                ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
                : booking.paymentStatus === "pending"
                ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                : "bg-gradient-to-r from-red-400 to-red-600 text-white"
            }`}
          >
            {booking.paymentStatus}
          </span>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={5} className="text-center py-8 text-gray-600 text-xl">
        No bookings found.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
}
