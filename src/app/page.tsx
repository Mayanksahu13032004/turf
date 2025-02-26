"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TurfFooter from "./_components/turfFooter";

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
  const [searchLocation, setSearchLocation] = useState("");
  const [searchName, setSearchName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/allturf");
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

        const data = await response.json();
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
    router.push(`/user/exploreturf/${id}`);
  };

  const filteredTurfs = turfs.filter(
    (turf) =>
      turf.location.toLowerCase().includes(searchLocation.toLowerCase()) &&
      turf.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="text-2xl font-bold">🏆 Turf Booking</div>
        <div>
          {userStorage ? (
            <div className="flex items-center space-x-4">
              <span>Welcome, {userStorage.user?.name || "Guest"}!</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link href="/login" className="hover:underline">Log In</Link>
              <Link href="/signup" className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-200">Sign Up</Link>
            </div>
          )}
        </div>
      </header>

      <div className="p-4 flex flex-col items-center space-y-3">
        <input
          type="text"
          placeholder="Search by location..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="w-full sm:w-96 p-3 border border-gray-300 rounded-lg shadow-sm"
        />
        <input
          type="text"
          placeholder="Search by turf name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-full sm:w-96 p-3 border border-gray-300 rounded-lg shadow-sm"
        />
      </div>

      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredTurfs.length > 0 ? (
          filteredTurfs.map((turf) => (
            <div
              key={turf._id}
              className="bg-white rounded-xl shadow-lg border overflow-hidden hover:shadow-2xl cursor-pointer"
              onClick={() => changeToExplore(turf._id)}
            >
              <img
                src={turf.images?.length ? turf.images[0] : "/fallback-image.jpg"}
                alt={turf.name}
                className="w-full h-52 object-cover rounded-t-xl"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold">{turf.name}</h3>
                <p className="text-gray-600">{turf.location}</p>
                <p className="text-gray-500">Size: {turf.size}</p>
                <p className="text-gray-500">Surface: {turf.surfaceType}</p>
                <p className="text-green-700 font-bold">₹{turf.pricePerHour}/hr</p>
                <button className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Book Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">No turfs found.</p>
        )}
      </main>

      <TurfFooter />
    </div>
  );
}
