"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import BookTurfButton from "../../../_components/BookTurfButton";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Pagination } from 'swiper/modules';

interface Review {
  _id: string;
  userId: string;
  name:string;
  rating: number;
  comment: string;
}

interface Turf {
  _id: string;
  name: string;
  location: string;
  pricePerHour: number;
  dynamicPricePerHour: number;
  size: string;
  capacity: number;
  amenities: string[];
  description?: string;
  images?: string[];
}

export default function Explore() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStorage, setUserStorage] = useState<{ user: { _id: string, name:string } } | null>(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [time, setTime] = useState("");

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchTurf = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/exploreturf/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        const data = await response.json();
        setTurf(data.result);
      } catch (err) {
        setError("Failed to load turf details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/users/review/${id}`);
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    const storedUser = localStorage.getItem("user")|| "{}";
    if (storedUser) setUserStorage(JSON.parse(storedUser));

    fetchTurf();
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async () => {
    try {
      if (!rating || !comment) {
        alert("Please provide both a rating and a comment.");
        return;
      }
  
      if (!userStorage?.user?._id ) {
        alert("Please log in to submit a review.");
        return;
      }
  
     const reviewData = {
  userId: userStorage.user._id,
  rating,
  comment, // ✅ now included
  name: userStorage.user.name || "Anonymous", // This is extra; backend doesn't handle it now
};

  
      const result = await axios.post(`http://localhost:3000/api/users/review/${id}`, reviewData);
  
      if (result.status === 201 || result.status === 200) {
        alert("Review submitted successfully!");
        setRating(0);
        setComment("");
  
        // Fetch updated reviews
        const res = await axios.get(`http://localhost:3000/api/users/review/${id}`);
        setReviews(res.data.reviews || []);
      } else {
        alert("Failed to submit the review. Please try again.");
      }
    } catch (error: any) {
      console.error("Error submitting review:", error?.response?.data || error.message);
      alert(error?.response?.data?.message || "Something went wrong. Please try again.");
    }
  };
  

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
      price: turf?.dynamicPricePerHour || 500,
      paymentStatus: "completed",
      transactionId: "",
    };
    
    const orderDatacheck = {
      date: selectedDate,
      startTime,
      endTime,
     
    };
    // Save to localStorage as a string
localStorage.setItem("orderData", JSON.stringify(orderData));

    try {
      const res = await axios.post(`http://localhost:3000/api/users/exploreturf/${id}/check`, orderDatacheck, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 201) {
        alert("Please book now and make a payment.");
      } else {
        alert("Order could not be placed!");
      }
    } catch (error) {
      alert("The time slot is unavailable! Please select another one.");
    }

    setTime(`${startTime}-${endTime}`);
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  if (!turf) return <div className="flex justify-center items-center min-h-screen">No Turf Found</div>;

  return (
  <>
    <div className="min-h-screen w-full bg-gray-100 text-black flex justify-center items-center p-6">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg p-6">
        {/* Turf Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{turf.name}</h1>
          <BookTurfButton turfId={turf._id} price={turf.dynamicPricePerHour} date={selectedDate} time={time} />
        </div>

        {/* Turf Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            {[{ label: "Size", value: turf.size },
              { label: "Capacity", value: `${turf.capacity} players` },
              { label: "Amenities", value: turf.amenities.join(", ") },
              { label: "Location", value: turf.location },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700">{label}</h2>
                <p className="text-gray-600">{value}</p>
              </div>
            ))}
          </div>

     <Swiper
  modules={[Navigation, Pagination]}
  navigation
  pagination={{ clickable: true }}
  className="w-full h-[80vh] rounded-xl overflow-hidden shadow-lg"
>
  {turf.images && turf.images.length > 0 ? (
    turf.images.map((img, index) => (
      <SwiperSlide key={index}>
        <img
          src={img}
          alt={`Turf image ${index + 1}`}
          className="w-full h-full object-cover"
        />
      </SwiperSlide>
    ))
  ) : (
    <SwiperSlide>
      <img
        src="/fallback-image.jpg"
        alt="Fallback Turf"
        className="w-full h-full object-cover"
      />
    </SwiperSlide>
  )}
</Swiper>

        </div>

     {/* Date Selection */}
<div className="mt-6">
  <label htmlFor="date" className="block text-lg font-bold mb-2">Select Date:</label>
  <input
    type="date"
    id="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    min={new Date().toISOString().split("T")[0]} // Prevent past dates
    className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500"
  />
</div>


        {/* Time Slots */}
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Available Time Slots:</h2>
          <div className="flex flex-wrap gap-4">
            {["10:00 AM - 12:00 PM", "2:00 PM - 4:00 PM", "6:00 PM - 8:00 PM"].map((slot) => {
              const [startTime, endTime] = slot.split(" - ");
              return (
                <button
                  key={slot}
                  onClick={() => handleOrderTurf(startTime, endTime)}
                  disabled={!selectedDate}
                  className="px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 transition-all duration-300 shadow-md"
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
   
        {/* Submit Review */}
 <div className="mt-10 border-t text-center pt-6 w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-2xl font-bold mb-4">Comments and Reviews</h2>

  <div className="flex items-center gap-2 mb-4">
    <div className="w-10 text-2xl font-bold h-10 bg-pink-500 text-white flex items-center justify-center rounded-full ">
      {userStorage?.user?.name?.charAt(0) || "U"}
    </div>
    <div>
      <p className="text-2xl font-bold">{userStorage?.user?.name || "Anonymous User"}</p>
      <p className="text-xl font-semibold text-gray-500">Posting publicly</p>
    </div>
  </div>

  {/* Stars */}
  <div className="flex items-center justify-start mb-4">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-7 h-7 cursor-pointer ${
          (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"
        }`}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
        onClick={() => setRating(star)}
      />
    ))}
  </div>

  {/* Comment Input */}
  <textarea
    className="w-full border-b-2 text-xl font-semibold border-gray-300 focus:outline-none focus:border-blue-600 p-2 mb-4 resize-none"
    rows={3}
    placeholder="Exceptional"
    value={comment}
    onChange={(e) => setComment(e.target.value)}
  />

  

  {/* Action Buttons */}
  <div className="flex justify-end gap-3">
    <button className="px-4 text-xl font-semibold py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100">
      Cancel
    </button>
    <button
      onClick={handleReviewSubmit}
      className="px-5 py-2 text-xl font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
    >
      Post
    </button>
  </div>
</div>



        {/* Display Reviews */}
      <div className="mt-10">
  <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-gray-800">All Reviews</h2>
  {reviews.length === 0 ? (
    <p className="text-gray-500 text-lg">No reviews yet.</p>
  ) : (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${star <= review.rating ? "text-yellow-500" : "text-gray-300"}`}
              />
            ))}
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-800">By: {userStorage?.user?.name}</h1>
            </div>
            <span className="ml-2 text-sm text-gray-600">({review.rating})</span>
          </div>
          <p className="text-gray-700 text-base">{review.comment}</p>
        </div>
      ))}
    </div>
  )}
</div>

    </>
  );
}