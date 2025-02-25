"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios"; // Import Axios

interface Turf {
  _id: string;
  name: string;
  location: string;
  pricePerHour: number;
  size: string;
  description?: string;
  images?: string[];
}

export default function Explore() {
  const { id } = useParams<{ id: string }>(); // Ensure correct type for `id`
  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userStorage, setUserStorage] = useState<{ user: { _id: string } } | null>(null);

  useEffect(() => {
    // Fetch Turf Details
    const fetchTurf = async () => {
      if (!id) return;

      try {
        const response = await fetch(`http://localhost:3000/api/users/exploreturf/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

        const data = await response.json();
        console.log("Fetched Turf Data:", data);
        setTurf(data.result);
      } catch (err) {
        console.error("Error fetching turf data:", err);
        setError("Failed to load turf details.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch User Data from LocalStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserStorage(JSON.parse(storedUser));
    }

    fetchTurf();
  }, [id]);

  // Function to Handle Booking
  const handleOrderTurf = async () => {
    if (!id) {
      alert("Turf ID is missing!");
      return;
    }

    if (!userStorage || !userStorage.user?._id) {
      alert("User not logged in!");
      return;
    }

    const orderData = {
      user_id: userStorage.user._id,
      turf_id: id,
      date: new Date().toISOString().split("T")[0],
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      price: turf?.pricePerHour || 500, // Default if price not available
      paymentStatus: "pending",
      transactionId: "",
    };

    try {
      const res = await axios.post(
        `http://localhost:3000/api/users/exploreturf/${id}`,
        orderData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 201) {
        alert("Order confirmed!");
        console.log("Order response:", res.data);
      } else {
        console.error("Order failed with status:", res.status);
        alert("Order could not be placed!");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-lg font-semibold text-red-500">{error}</div>
      </div>
    );

  if (!turf)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-lg font-semibold text-gray-500">No Turf Found</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          src={turf.images && turf.images.length > 0 ? turf.images[0] : "/fallback-image.jpg"}
          alt={turf.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800">{turf.name}</h1>
          <p className="text-lg text-gray-600 mt-1">{turf.location}</p>
          <p className="text-gray-500 text-sm mt-1">Size: {turf.size}</p>
          {turf.description && (
            <p className="text-gray-700 text-sm mt-2">{turf.description}</p>
          )}
          <p className="mt-4 text-green-600 font-bold text-xl">
            ₹{turf.pricePerHour}/hr
          </p>
          <button
            onClick={handleOrderTurf} // Booking function on click
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
