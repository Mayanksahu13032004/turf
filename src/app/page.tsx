"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TurfFooter from "./_components/turfFooter";
import AboutUs from "./_components/aboutUs";
import Terms from "./_components/terms";
import Privacy from "./_components/privacy";
import Notifications from "./_components/notifications";
import Refer from "./_components/refer";
import Vlog from "./_components/vlog";
import Chatbot from "./_components/aichat";
import ReferralLink from "./_components/refrencelink";
import ChatbotPromptExamples from "./_components/ChatbotPromptExamples";

// Turf and User Types
interface Turf {
  _id: string;
  name: string;
  location: string;
  pricePerHour: number;
  dynamicPricePerHour: number;
  size: string;
  surfaceType: string;
  amenities: string[];
  availability: { date: string; slots: string[] }[];
  images?: string[];
  createdAt: string;
}

interface User {
  name: string;
  email: string;
  token: string;
}

interface Review {
  rating: number;
  turf_id: string;
}

type RatingMap = {
  [turfId: string]: { avg: number; count: number };
};

export default function Home() {
  const [userStorage, setUserStorage] = useState<User | null>(null);
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [ratings, setRatings] = useState<RatingMap>({});
  const [price, setPrice] = useState(null);
  const router = useRouter();

  const getUserID = (): string | null => {
    if (typeof window !== "undefined") {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedData = JSON.parse(userData);
          const user = parsedData?.user || parsedData;
          return user?._id || user?.id || null;
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    return null;
  };

  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    setUserID(getUserID());
  }, []);

  useEffect(() => {
    fetch("/api/updatePrice")
      .then((res) => res.json())
      .then((data) => setPrice(data.dynamicPrice))
      .catch((err) => console.error("Error fetching price:", err));
  }, []);

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const response = await fetch("/api/users/allturf");
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

  // ⭐ Fetch Reviews and Calculate Average Rating
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const allRatings: RatingMap = {};
        const fetches = turfs.map(async (turf) => {
          const res = await fetch(`/api/users/review/${turf._id}`);
          const data = await res.json();
          const reviews: Review[] = data.reviews || [];

          if (reviews.length > 0) {
            const total = reviews.reduce((sum: number, r: Review) => sum + r.rating, 0);
            allRatings[turf._id] = {
              avg: parseFloat((total / reviews.length).toFixed(1)),
              count: reviews.length,
            };
          }
        });

        await Promise.all(fetches);
        setRatings(allRatings);
      } catch (err) {
        console.error("Error fetching ratings:", err);
      }
    };

    if (turfs.length) fetchReviews();
  }, [turfs]);

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
        className="relative w-full h-[40vh] md:h-[100vh] bg-[url('/image.png')] bg-cover bg-center flex flex-col items-center justify-center text-white text-center"
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
      <section className="px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTurfs.length > 0 ? (
          filteredTurfs.map((turf) => {
            const ratingInfo = ratings[turf._id];

            return (
              <div
                key={turf._id}
                onClick={() => router.push(`/user/exploreturf/${turf._id}`)}
                className="relative group bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transform hover:-translate-y-2 transition-all flex flex-col"
              >
                {/* Image */}
                <div className="w-full h-48 sm:h-52 md:h-56 overflow-hidden">
                  <img
                    src={turf.images?.[0] || "/fallback-image.jpg"}
                    alt={turf.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-4">
                  <h3 className="text-lg font-bold mb-1 truncate">{turf.name}</h3>
                  <p className="text-sm text-gray-500 mb-2 truncate">📍 {turf.location}</p>

                  <div className="mt-auto">
                    <p className="text-green-600 font-bold text-base">₹{turf.pricePerHour}/hr</p>
                    {turf.dynamicPricePerHour && (
                      <p
                        className={`text-sm font-semibold mt-1 ${
                          turf.dynamicPricePerHour < turf.pricePerHour
                            ? "text-red-500"
                            : "text-green-600"
                        }`}
                      >
                        {turf.dynamicPricePerHour < turf.pricePerHour
                          ? `🔥 ₹${turf.dynamicPricePerHour}/hour`
                          : `💰 ₹${turf.dynamicPricePerHour}/hour`}
                      </p>
                    )}
                  </div>
                </div>

                {/* ⭐ Hover Rating */}
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
<<<<<<< HEAD
  {ratingInfo ? (
    <div className="text-center text-3xl font-bold">
      <div className="flex justify-center mb-2">
        {Array.from({ length: Math.round(ratingInfo.avg) }, (_, i) => (
          <span className="text-2xl fonr-bold" key={i}>⭐</span>
        ))}
      </div>
      {ratingInfo.avg} / 5 <br />
      {/* ({ratingInfo.count} review{ratingInfo.count > 1 ? "s" : ""}) */}
    </div>
  ) : ( <div className="text-3xl font-bold">
    "No ratings yet"
    </div>
  )}
</div>

              </div>
            );
          })
        ) : (
          <p className="text-center col-span-full text-gray-500 text-lg">No turfs found.</p>
        )}
      </section>

=======
                  {ratingInfo ? (
                    <div className="text-center">
                      ⭐ {ratingInfo.avg} / 5 <br />
                      ({ratingInfo.count} review{ratingInfo.count > 1 ? "s" : ""})
                    </div>
                  ) : (
                    "No ratings yet"
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center col-span-full text-gray-500 text-lg">No turfs found.</p>
        )}
      </section>

>>>>>>> 7c0b461 (deploying)
      {/* Extras */}
      <Vlog />
      <Chatbot />
      <AboutUs />
      <ReferralLink />
      <ChatbotPromptExamples />
      <Terms />
      <Privacy />
      <Notifications />
    </div>
  );
}
