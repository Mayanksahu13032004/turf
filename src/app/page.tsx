"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TurfFooter from "./_components/turfFooter";
import { Menu, X } from "lucide-react";
import Navbar from "./_components/navbar";


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

  const [isOpen, setIsOpen] = useState(false);
  const [userStorage, setUserStorage] = useState<User | null>(null);
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const router = useRouter();


  const getUserID = (): string | null => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      console.log("usersdarda",userData);
      
      return userData ? JSON.parse(userData).user._id || JSON.parse(userData).user.id : null;
    }
    return null;
  };
  

  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    setUserID(getUserID());
  }, []);

  console.log("User ID:", userID);


  // Fetch turfs from API
  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/allturf");
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

        const data = await response.json();

        if (Array.isArray(data.result)) {
          const turfsWithImages: Turf[] = data.result.map((turf: Turf) => ({
            ...turf,
            images: turf.images ?? [], // Ensure images is always an array
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

  // Load user from local storage
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

  // Logout function
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="flex items-center justify-between p-5 bg-green-700 text-white shadow-lg">
    {/* Logo */}
    <div className="flex items-center space-x-3">
      <img src="/logo.png" alt="TurfMate Logo" className="h-12 w-auto" />
      <div className="text-2xl font-bold">TurfMate</div>
    </div>

    <nav className="hidden md:flex space-x-6 text-lg">
          <Link href="/" className="relative group">
            Home
            <span className="absolute left-0 bottom-0 w-0 h-1 bg-white transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/contact" className="relative group">
            Contact
            <span className="absolute left-0 bottom-0 w-0 h-1 bg-white transition-all group-hover:w-full"></span>
          </Link>
          <button
      onClick={() => router.push(`/user/allbookings/${userID}`)}
      className="relative group px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all"
    >
      All Bookings
      <span className="absolute left-0 bottom-0 w-0 h-1 bg-white transition-all group-hover:w-full"></span>
    </button>
        </nav>



    <div className="hidden md:flex items-center space-x-6">
     
      {userStorage ? (
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600">
          Logout
        </button>
      ) : (
        <>
          <Link href="/login" className="hover:underline self-center">Log In</Link>
          <Link href="/signup" className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-200">Sign Up</Link>
        </>
      )}
    </div>
  </header>
  <Navbar/>

      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center justify-center bg-green-700 text-white py-3 space-y-3">
          <Link href="/" className="hover:underline" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/about" className="hover:underline" onClick={() => setIsMenuOpen(false)}>About Us</Link>
          <Link href="/contact" className="hover:underline" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          {userStorage ? (
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600">
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="hover:underline " onClick={() => setIsMenuOpen(false)}>Log In</Link>
              <Link href="/signup" className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-200">Sign Up</Link>
            </>
          )}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative w-full h-[100vh] bg-cover bg-center flex flex-col items-center justify-center text-white text-center" style={{ backgroundImage: "url('/image.png')" }}>
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
            const availableSlots = turf.availability?.length ? turf.availability[0].slots : [];
            const randomSlot =
            turf.availability?.length &&
            turf.availability[Math.floor(Math.random() * turf.availability.length)]?.slots?.length
              ? turf.availability[Math.floor(Math.random() * turf.availability.length)].slots[0]
              : "No slots available";
          
          

            return (
              <div key={turf._id} className="relative group bg-gray-200 text-black rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all  transform hover:-translate-y-2 cursor-pointer " onClick={() => router.push(`/user/exploreturf/${turf._id}`)}>
                <img src={turf.images?.[0] || "/fallback-image.jpg"} alt={turf.name} className="w-full h-52 object-cover rounded-t-2xl"/>
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

      <TurfFooter />
    </div>
  );
}
