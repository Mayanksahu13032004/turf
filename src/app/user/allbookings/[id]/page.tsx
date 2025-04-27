"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Booking {
  _id: string;
  userId: string;
  startTime: string;
  name: string;
  endTime: string;
  date: string;
  price: string;
  paymentStatus: string;
  status: string;
  turf_id?: { _id: string; name: string } | null;
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

  const generatePDF = (booking: Booking) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("Turf Booking Confirmation", 20, 20);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    const details = [
      ["Booking ID", booking._id],
      ["Turf Name", booking.turf_id?.name || "N/A"],
      ["Date", booking.date],
      ["Time", `${booking.startTime} - ${booking.endTime}`],
      ["Amount", booking.price],
      ["Payment Status", booking.paymentStatus.toUpperCase()],
    ];

    details.forEach((detail, index) => {
      doc.text(`${detail[0]}`, 20, 40 + index * 10);
      doc.setTextColor(20, 100, 200);
      doc.text(`${detail[1]}`, 80, 40 + index * 10);
      doc.setTextColor(60, 60, 60);
    });

    const now = new Date();
    const downloadDate = now.toLocaleDateString();
    const downloadTime = now.toLocaleTimeString();

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Downloaded on: ${downloadDate} at ${downloadTime}`, 20, 100);
    doc.save(`Booking_${booking._id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-12 px-6">
      <h1 className="text-4xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-10 drop-shadow-lg">
        📋 Turf Bookings
      </h1>

      {/* Table Container */}
      <div className="max-w-8xl mx-auto overflow-x-auto bg-white shadow-2xl rounded-lg border border-gray-200">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-600 text-white">
            <tr>
              <th className="py-5 px-6 text-left text-lg sm:text-xl md:text-2xl font-bold">
                Booking ID
              </th>
              <th className="py-5 px-6 text-left font-bold text-lg sm:text-xl md:text-2xl">
                Turf Name
              </th>
              <th className="py-5 px-6 text-left font-bold text-lg sm:text-xl md:text-2xl">
                📅 Date
              </th>
              <th className="py-5 px-6 text-left font-bold text-lg sm:text-xl md:text-2xl">
                ⏰ Time Slot
              </th>
              <th className="py-5 px-6 text-center font-bold text-lg sm:text-xl md:text-2xl">
                Status
              </th>
              <th className="py-5 px-6 text-center font-bold text-lg sm:text-xl md:text-2xl">
                Download Receipt
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300 text-lg sm:text-base md:text-lg">
            {turfBookings.length > 0 ? (
              turfBookings.map((booking, index) => (
                <tr
                  key={booking._id}
                  className={`transition-all duration-200 hover:scale-[1.02] hover:bg-blue-50 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <td className="py-6 px-8 font-semibold text-gray-900">{booking._id}</td>
                  <td className="py-6 px-8 text-gray-800 text-xl sm:text-2xl font-extrabold">
                    {booking.turf_id?.name || "N/A"}
                  </td>
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

                  <td className="py-6 px-8 text-center">
                    <button
                      onClick={() => generatePDF(booking)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-all"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-600 text-xl">
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
