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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="text-2xl font-bold tracking-wide">🏆 Turf Booking</div>
        <div>
          {userStorage ? (
            <div className="flex items-center space-x-4">
              <span className="font-semibold">Welcome, {userStorage.user?.name || "Guest"}!</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link href="/login" className="hover:underline">
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-200 transition shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Turf Cards */}
      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {turfs.length > 0 ? (
          turfs.map((turf) => (
            <div
              key={turf._id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition cursor-pointer transform hover:-translate-y-1"
              onClick={() => changeToExplore(turf._id)}
            >
              <img
                src={turf.images?.length ? turf.images[0] : "/fallback-image.jpg"}
                alt={turf.name}
                className="w-full h-52 object-cover rounded-t-xl"
              />
              <div className="p-5 space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">{turf.name}</h3>
                <p className="text-gray-600">{turf.location}</p>
                <p className="text-gray-500 text-sm">Size: <span className="font-medium">{turf.size}</span></p>
                <p className="text-gray-500 text-sm">Surface: <span className="font-medium">{turf.surfaceType}</span></p>

                {/* Amenities Section */}
                {turf.amenities?.length > 0 && (
                  <p className="text-gray-500 text-sm">
                    <span className="font-medium">Amenities:</span> {turf.amenities.join(", ")}
                  </p>
                )}

                {/* Availability Section */}
                {turf.availability?.length > 0 && (
                  <p className="text-gray-500 text-sm">
                    <span className="font-medium">Available Dates:</span> {turf.availability.map((av) => av.date).join(", ")}
                  </p>
                )}

                <p className="text-green-700 font-bold text-lg mt-2">
                  ₹{turf.pricePerHour}/hr
                </p>
                <button className="mt-3 w-full px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition shadow-md">
                  Book Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500 text-lg">
            No turfs available.
          </p>
        )}
      </main>
    </div>
  );
}
