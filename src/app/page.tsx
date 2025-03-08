"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TurfFooter from "./_components/turfFooter";
// import Navbar from "./_components/navbar";
import AboutUs from "./_components/aboutUs";
import Terms from "./_components/terms";
import Privacy from "./_components/privacy";
import Notifications from "./_components/notifications";
import Refer from "./_components/refer";

// Define Turf type
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

// Define User type
interface User {
  name: string;
  email: string;
  token: string;
}

export default function Home() {
  const [userStorage, setUserStorage] = useState<User | null>(null);
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const router = useRouter();

  const getUserID = (): string | null => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      return userData
        ? JSON.parse(userData).user._id || JSON.parse(userData).user.id
        : null;
    }
    return null;
  };

  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    setUserID(getUserID());
  }, []);

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/allturf");
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

        const data = await response.json();

        if (Array.isArray(data.result)) {
          const turfsWithImages: Turf[] = data.result.map((turf: Turf) => ({
            ...turf,
            images: turf.images ?? [],
          }));
          setTurfs(turfsWithImages);
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

  const filteredTurfs = turfs.filter(
    (turf) =>
      turf.location.toLowerCase().includes(searchLocation.toLowerCase()) &&
      turf.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col">
      

      {/* Hero Section */}
      <section
        className="relative w-full h-[100vh] bg-cover bg-center flex flex-col items-center justify-center text-white text-center"
        style={{ backgroundImage: "url('/image.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-0"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold">Book Your Game, Anytime, Anywhere!</h1>
          <p className="mt-2 text-lg">Find and book the best turfs near you</p>
          <div className="mt-4 flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Search by location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full sm:w-80 p-3 border border-white rounded-lg shadow-sm bg-transparent text-white placeholder:text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by turf name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full sm:w-80 p-3 border border-white rounded-lg shadow-sm bg-transparent text-white placeholder:text-gray-400"
            />
          </div>
        </div>
      </section>

      {/* Turf Listings */}
      <section className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-grow">
        {filteredTurfs.length > 0 ? (
          filteredTurfs.map((turf) => {
            const randomSlot =
              turf.availability?.length &&
              turf.availability[Math.floor(Math.random() * turf.availability.length)]
                ?.slots?.length
                ? turf.availability[Math.floor(Math.random() * turf.availability.length)]
                    .slots[0]
                : "No slots available";

            return (
              <div
                key={turf._id}
                className="relative group bg-gray-200 text-black rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-2 cursor-pointer"
                onClick={() => router.push(`/user/exploreturf/${turf._id}`)}
              >
                <img
                  src={turf.images?.[0] || "/fallback-image.jpg"}
                  alt={turf.name}
                  className="w-full h-52 object-cover rounded-t-2xl"
                />
                <div className="p-5">
                  <h3 className="text-xl font-bold">{turf.name}</h3>
                  <p className="text-sm">📍 {turf.location}</p>
                  <p className="text-green-600 font-bold text-lg">₹{turf.pricePerHour}/hr</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-all">
                  Available Slot: {randomSlot}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center col-span-3 text-gray-500">No turfs found.</p>
        )}
      </section>
<AboutUs/>
<Terms/>
<Privacy/>
<Notifications/>
<Refer/>

      
    </div>
  );
}
