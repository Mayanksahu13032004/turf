'use client'
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
  
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const fetchTurf = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/exploreturf/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

        const data = await response.json();
        console.log("Fetched Turf Data:", data);
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

  const handleOrderTurf = async (startTime: string, endTime: string) => {
    if (!id || !userStorage?.user?._id) {
      alert("Please log in to book a turf.");
      router.push("/login");
      return;
    }

    if (!selectedDate) {
      alert("Please select a date before booking.");
      return;
    }



    const orderData = {
      user_id: userStorage.user._id,
      turf_id: id,
      date: selectedDate,
      startTime,
      endTime,
      price: turf?.pricePerHour || 500,
      paymentStatus: "pending",
      transactionId: "",
    };

    try {
      const res = await axios.post(`http://localhost:3000/api/users/exploreturf/${id}`, orderData, {
        headers: { "Content-Type": "application/json" },
      });

console.log("lali don order",res);

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
    <div className="h-[100vh] w-full bg-white text-black flex justify-center items-center">
      <div className="h-[80%] w-[80%] bg-white flex flex-col gap-8 p-8 rounded-lg shadow-lg">
        {/* Turf Image */}
        {turf.images && turf.images.length > 0 && (
          <img src={turf.images[0]} alt={turf.name} className="w-full h-64 object-cover rounded-lg" />
        )}

        {/* Turf Details */}
        <div className="text-center">
          <h1 className="font-bold text-3xl">{turf.name}</h1>
          <p className="text-gray-600 mt-2">{turf.location}</p>
          <p className="text-lg font-semibold text-green-600 mt-1">₹{turf.pricePerHour} per hour</p>
          <p className="text-md text-gray-500 mt-1">Size: {turf.size}</p>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="text-lg font-bold">Amenities:</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {turf.amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
        </div>

        {/* Date Selection */}
        <div className="flex flex-col gap-4 items-center">
          <label htmlFor="date" className="text-lg font-bold">Select Date:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>

        {/* Available Time Slots */}
        <div className="flex flex-wrap justify-center gap-4">
          {["10:00 AM - 12:00 PM", "2:00 PM - 4:00 PM", "6:00 PM - 8:00 PM"].map((slot) => {
            const [startTime, endTime] = slot.split(" - ");
            // const isBooked = bookedSlots.some(slot => slot.date === selectedDate && slot.startTime === startTime && slot.endTime === endTime);

            return (
              <button
                key={slot}
                onClick={() => handleOrderTurf(startTime, endTime)}
                className={`px-4 py-2 rounded-lg ${
                 "bg-green-500 hover:bg-green-600"
                }`}
                disabled={ !selectedDate}
              >
                {slot} { "(Booked)"}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
