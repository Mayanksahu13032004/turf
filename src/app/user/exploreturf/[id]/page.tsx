"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Turf {
  _id: string;
  name: string;
  location: string;
  pricePerHour: number;
  size: string;
  description?: string;
  images?: string[]; // Backend might return an array of images
}

export default function Explore() {
  const { id } = useParams<{ id: string }>(); // Ensure correct type for `id`
  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTurf = async () => {
      if (!id) return; // Ensure ID is available before making API call

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

    fetchTurf();
  }, [id]);

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
          <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
