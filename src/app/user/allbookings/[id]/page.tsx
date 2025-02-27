"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Booking {
  _id: string;
  userId: string;
  
  date: string;
  timeSlot: string;
  status: string;
  name:string;
  turf_id: { _id: string; name: string }; 
  // turf_id:string;
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
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        📋 Turf Bookings
      </h1>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
          {/* Table Head */}
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Booking ID</th>
              <th className="py-3 px-6 text-left">User ID</th>
              <th className="py-3 px-6 text-left">Turf Name</th>
              <th className="py-3 px-6 text-left">📅 Date</th>
              <th className="py-3 px-6 text-left">⏰ Time Slot</th>
              <th className="py-3 px-6 text-center">Status</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-gray-600 text-sm">
            {turfBookings.length > 0 ? (
              turfBookings.map((booking, index) => (
                <tr
                  key={booking._id}
                  className={`border-b border-gray-300 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition-all`}
                >
                  <td className="py-4 px-6">{booking._id}</td>
                  <td className="py-4 px-6">{booking.userId}</td>
                  <td className="py-4 px-6">{booking.turf_id.name}</td>
                  <td className="py-4 px-6">{booking.date}</td>
                  <td className="py-4 px-6">{booking.timeSlot}</td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`px-4 py-2 text-xs font-semibold rounded-full ${
                        booking.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
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
