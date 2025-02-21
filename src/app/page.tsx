"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Turf {
  _id: string;
  name: string;
  location: string;
  pricePerHour: number;
  size: string;
  surfaceType: string;
  amenities: string[];
  availability: { date: string; slots: string[] }[];
  images?: string[];
  createdAt: string;
}

export default function Home() {
  const [userStorage, setUserStorage] = useState<any | null>(null);
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/allturf");
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

        const data = await response.json();
        console.log("API Response:", data);

        if (Array.isArray(data.result)) {
          setTurfs(data.result);
        } else {
          console.error("Unexpected API response format:", data);
          setTurfs([]);
        }
      } catch (error) {
        console.error("Error fetching turf data:", error);
        setTurfs([]);
      }
    };

    fetchTurfs();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");
        setUserStorage(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUserStorage(null);
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      setUserStorage(null);
    }
  };

  const changeToExplore = (id: string) => {
    console.log("Ids of the turf explore", id);
    router.push(`/user/exploreturf/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-green-600 text-white shadow-md">
        <div className="text-xl font-bold">🏆 Turf Booking</div>
        <div>
          {userStorage ? (
            <div className="flex items-center space-x-4">
              <span className="text-white font-semibold">
                Welcome, {userStorage.user?.name || "Guest"}!
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="mr-4 hover:underline">
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-white text-green-600 rounded-md hover:bg-gray-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Turf Cards */}
      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {turfs.length > 0 ? (
          turfs.map((turf) => (
            <div
              key={turf._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
              onClick={() => changeToExplore(turf._id)}
            >
              <img
                src={turf.images?.length ? turf.images[0] : "/fallback-image.jpg"}
                alt={turf.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{turf.name}</h3>
                <p className="text-gray-600">{turf.location}</p>
                <p className="text-gray-500 text-sm">Size: {turf.size}</p>
                <p className="text-gray-500 text-sm">Surface: {turf.surfaceType}</p>
                
                {/* Amenities Section */}
                {turf.amenities?.length > 0 && (
                  <p className="text-gray-500 text-sm">
                    Amenities: {turf.amenities.join(", ")}
                  </p>
                )}

                {/* Availability Section */}
                {turf.availability?.length > 0 && (
                  <p className="text-gray-500 text-sm">
                    Available Dates:{" "}
                    {turf.availability.map((av) => av.date).join(", ")}
                  </p>
                )}

                <p className="text-green-600 font-bold mt-2">
                  ₹{turf.pricePerHour}/hr
                </p>
                <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                  Book Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            No turfs available.
          </p>
        )}
      </main>
    </div>
  );
}
