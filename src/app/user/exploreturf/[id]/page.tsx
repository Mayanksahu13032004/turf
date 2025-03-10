"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import BookTurfButton from "../../../_components/BookTurfButton";


interface Turf {
  _id: string;
  name: string;
  location: string;
  pricePerHour: number;
  dynamicPricePerHour:number;
  size: string;
  capacity: number;
  amenities: string[];
  description?: string;
  images?: string[];
}

export default function Explore() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userStorage, setUserStorage] = useState<{ user: { _id: string } } | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const fetchTurf = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/exploreturf/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

        const data = await response.json();
        console.log("Fetched Turf Data:", data);
        setTurf(data.result);
      } catch (err) {
        setError("Failed to load turf details.");
      } finally {
        setLoading(false);
      }
    };

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserStorage(JSON.parse(storedUser));
    }

    fetchTurf();
  }, [id]);

  const handleOrderTurf = async (startTime: string, endTime: string) => {
    if (!id || !userStorage?.user?._id) {
      alert("Please log in to book a turf.");
      router.push("/login");
      return;
    }

    if (!selectedDate) {
      alert("Please select a date before booking.");
      return;
    }

    const orderData = {
      user_id: userStorage.user._id,
      turf_id: id,
      date: selectedDate,
      startTime,
      endTime,
      price: turf?.dynamicPricePerHour || 500,
      paymentStatus: "completed",
      transactionId: "",
    };

    try {
      const res = await axios.post(`http://localhost:3000/api/users/exploreturf/${id}`, orderData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Order Response:", res);

      if (res.status === 201) {
        alert("Please book now and make a payment.");
      } else {
        alert("Order could not be placed!");
      }
    } catch (error) {
      alert("The time slot is unavailable! Please select another time slot.");
    }
    setTime(`${startTime}-${endTime}`);
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  if (!turf) return <div className="flex justify-center items-center min-h-screen">No Turf Found</div>;

  return (
    <div className="min-h-screen w-full bg-gray-100 text-black flex justify-center items-center p-6">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg p-6">
        {/* Turf Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{turf.name}</h1>
          <BookTurfButton turfId={turf._id} price={turf.dynamicPricePerHour} date={selectedDate} time={time} />
        </div>

        {/* Turf Details */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Section: Turf Info */}
          <div className="flex flex-col gap-4">
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700">Size</h2>
              <p className="text-gray-600">{turf.size}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700">Capacity</h2>
              <p className="text-gray-600">{turf.capacity} players</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700">Amenities</h2>
              <p className="text-gray-600">{turf.amenities.join(", ")}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700">Location</h2>
              <p className="text-gray-600">{turf.location}</p>
            </div>
          </div>

          {/* Right Section: Turf Image */}
          <div>
            <img
              className="w-full h-60 object-cover rounded-lg shadow-md"
              src={turf.images && turf.images.length > 0 ? turf.images[0] : "/fallback-image.jpg"}
              alt={turf.name}
            />
          </div>
        </div>



        {/* Date Selection */}
        <div className="mt-6">
          <label htmlFor="date" className="block text-lg font-bold mb-2">
            Select Date:
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Available Time Slots */}
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Available Time Slots:</h2>
          <div className="flex flex-wrap gap-4">
            {["10:00 AM - 12:00 PM", "2:00 PM - 4:00 PM", "6:00 PM - 8:00 PM"].map((slot) => {
              const [startTime, endTime] = slot.split(" - ");

              return (
                <button
                  key={slot}
                  onClick={() => {
                    handleOrderTurf(startTime, endTime);
                    setTime(slot);
                  }}
                  className="px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 transition-all duration-300 shadow-md"
                  disabled={!selectedDate}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
