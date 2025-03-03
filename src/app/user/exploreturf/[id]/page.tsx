'use client'
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import BookTurfButton from "../../../_components/BookTurfButton"

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
  const [time, settime] = useState<string>("");

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
    console.log("Updated time:", time);
     
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
      paymentStatus: "completed",
      transactionId: "",
    };

    try {
      const res = await axios.post(`http://localhost:3000/api/users/exploreturf/${id}`, orderData, {
        headers: { "Content-Type": "application/json" },
      });

console.log("lali don order",res);

      if (res.status === 201) {
        alert("Please Book now and make a payement...");
        // router.push(`/user/allbookings/${userStorage.user._id}`);
      } else {
        alert("Order could not be placed!");
      }
    } catch (error) {
      alert("The time slot is Unavilable ! Please select another time slot");
    }
      settime(`${startTime}-${endTime}`)
     
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  if (!turf) return <div className="flex justify-center items-center min-h-screen">No Turf Found</div>;

  return (
    <div className="h-[100vh] w-full bg-white text-black flex justify-center items-center">
      <div className="h-[80%] w-[80%] bg-white flex flex-col gap-8 p-8 rounded-lg shadow-lg">
      <div className="h-[100vh] w-[100%] bg-white text-black flex justify-center items-center ">
 <div className="h-[80%] w-[80%] bg-white flex flex-col gap-14">
      <div className="flex justify-between px-10"> <span className="font-bold text-3xl">{turf.name}</span> 
      

      <BookTurfButton turfId={turf._id} price={turf.pricePerHour} date={selectedDate} time={time} />


      </div>
      <div className="flex  text-white ">
       <div className="flex w-[50%] gap-10">
        <div className="flex flex-col gap-8 w-[30%]  items-center text-black">
        <div className="flex flex-col gap-1 text-center py-5 w-[100%] bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
  <span className="text-xl text-black font-bold  ">Size</span>
  <span>{turf.size}</span>
  <span className="text-xl text-black font-bold">Capacity</span>
  <span>{turf.capacity}</span>
</div>

<div className="flex flex-col gap-1 text-center w-[100%] py-5 bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
  <span className="text-xl text-black font-bold">Amenities</span>
  <span>{turf.amenities}</span>
</div>

        </div>
        <div className="flex flex-col w-[50%] gap-8 text-black">
  <div className="w-[100%] flex flex-col py-5 px-3 bg-white text-black rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
    <span className="text-xl text-black font-bold text-center">description</span>
    <span className="text-center">
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi, assumenda!
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magnam, temporibus.
    </span>
  </div>
  <div className="flex flex-col w-[100%] py-5 px-3 bg-white text-black rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
    <span className="text-xl text-black font-bold text-center">location</span>
    <span className="text-center">
      Lorem ipsum, dolor sit amet consectetur adipisicing {turf.location}
    </span>
  </div>
</div>

       </div>
       <div className="h-[100%] w-[50%] ">
       <img 
             className="h-96 rounded-3xl"
             src={turf.images && turf.images.length > 0 ? turf.images[0] : "/fallback-image.jpg"}
             alt={turf.name}
           
        />
       </div>
      </div>
    </div>
     
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
               onClick={()=>{
                handleOrderTurf(startTime, endTime),
                console.log(slot)
                settime(slot)
                // Logs `time` whenever it changes
                
               }}
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
