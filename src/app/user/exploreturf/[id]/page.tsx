"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

interface Turf {
  _id: string;
  name: string;
  location: string;
  pricePerHour: number;
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

  useEffect(() => {
    const fetchTurf = async () => {
      if (!id) return;

      try {
        const response = await fetch(`http://localhost:3000/api/users/exploreturf/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

        const data = await response.json();
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

  const handleOrderTurf = async () => {
    if (!id || !userStorage?.user?._id) {
      alert("Please log in to book a turf.");
      router.push("/login");
      return;
    }

    const orderData = {
      user_id: userStorage.user._id,
      turf_id: id,
      date: new Date().toISOString().split("T")[0],
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      price: turf?.pricePerHour || 500,
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
        router.push(`/user/allbookings/${userStorage.user._id}`);
      } else {
        alert("Order could not be placed!");
      }
    } catch (error) {
      alert("An error occurred while placing the order.");
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  if (!turf) return <div className="flex justify-center items-center min-h-screen">No Turf Found</div>;

  return (
    <div className="min-h-screen flex justify-center items-center p-6 bg-gray-100">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{turf.name}</h1>
          <p className="text-lg text-gray-600 mt-1">{turf.location}</p>
          <div className="mt-4 grid gap-4">
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-gray-500 text-sm">Size</p>
              <p className="font-semibold">{turf.size}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-gray-500 text-sm">Capacity</p>
              <p className="font-semibold">{turf.capacity} people</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-gray-500 text-sm">Amenities</p>
              <p className="font-semibold">{turf.amenities.join(", ")}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-gray-500 text-sm">Description</p>
              <p className="text-sm text-gray-700">{turf.description}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-gray-500 text-sm">Location</p>
              <p className="text-sm text-gray-700">{turf.location}</p>
            </div>
          </div>
          <button
            onClick={handleOrderTurf}
            className="mt-6 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Book Now
          </button>
        </div>
        <div>
          <img
            src={turf.images && turf.images.length > 0 ? turf.images[0] : "/fallback-image.jpg"}
            alt={turf.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
