"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Booking {
  _id: string;
  userId: string;
  turfId: string;
  date: string;
  timeSlot: string;
  status: string;
}

export default function TurfBookings() {
  const [turfBookings, setTurfBookings] = useState<Booking[]>([]);
  const params = useParams();

  useEffect(() => {
    const id = params.id as string;

    const fetchAllBookings = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/exploreturf/allbooking/${id}`);
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
    <div className="max-w-6xl bg-white mx-auto px-6 py-10">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">📋 Turf Bookings</h1>

      {/* Bookings List */}
      {turfBookings.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turfBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white shadow-xl rounded-2xl p-6 transition transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">Booking ID: {booking._id}</h2>
              <p className="text-gray-600">
                <span className="font-semibold">User ID:</span> {booking.userId}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Turf ID:</span> {booking.turfId}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">📅 Date:</span> {booking.date}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">⏰ Time Slot:</span> {booking.timeSlot}
              </p>

              {/* Status Badge */}
              <span
                className={`inline-block mt-3 px-4 py-2 text-sm font-semibold rounded-full ${
                  booking.status === "Confirmed"
                    ? "bg-green-100 text-green-700"
                    : booking.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">No bookings found.</p>
      )}
    </div>
  );
}
