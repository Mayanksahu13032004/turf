"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Define the user type
interface User {
  name: string;
  email: string;
}

const turfs = [
  {
    id: 1,
    name: "Green Valley Turf",
    location: "Indore, MP",
    price: "₹500/hr",
    image: "/turf1.jpg",
  },
  {
    id: 2,
    name: "Elite Sports Arena",
    location: "Bhopal, MP",
    price: "₹700/hr",
    image: "/turf2.jpg",
  },
  {
    id: 3,
    name: "Pro Play Ground",
    location: "Mumbai, MH",
    price: "₹600/hr",
    image: "/turf3.jpg",
  },
];

export default function Home() {
  const [userStorage, setUserStorage] = useState<any | null>(null);

  // Retrieve user data from localStorage when page loads
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
   console.log("userstorasge darta in root",userStorage);
  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user data
    setUserStorage(null); // Update UI
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-green-600 text-white shadow-md">
        <div className="text-xl font-bold">🏆 Turf Booking</div>
        
        <div>
          {userStorage ? (
            <div className="flex items-center space-x-4">
              <span className="text-white font-semibold">Welcome, {userStorage.user.name}!</span>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="mr-4 hover:underline">Log In</Link>
              <Link href="/signup" className="px-4 py-2 bg-white text-green-600 rounded-md hover:bg-gray-200">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Turf Cards */}
      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {turfs.map((turf) => (
          <div key={turf.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image src={turf.image} alt={turf.name} width={400} height={250} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{turf.name}</h3>
              <p className="text-gray-600">{turf.location}</p>
              <p className="text-green-600 font-bold">{turf.price}</p>
              <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
