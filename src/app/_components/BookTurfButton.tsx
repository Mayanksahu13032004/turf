"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

interface BookTurfButtonProps {
  turfId: string;
  price: number;
  date: string;
  time: string; // expected format: "2:00 PM-4:00 PM"
}

// Utility to convert "2:00 PM" to "14:00"
const convertTo24Hour = (time12h: string): string => {
  const [time, modifier] = time12h.trim().split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export default function BookTurfButton({ turfId, price, date, time }: BookTurfButtonProps) {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.user && parsed.user._id) {
          setUserId(parsed.user._id);
        } else {
          console.error("User ID not found in stored object");
        }
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

  const handleCheckout = async () => {
    if (!userId) {
      alert("User not found. Please log in again.");
      return;
    }

    if (!date || !time) {
      alert("Please fill in both date and time.");
      return;
    }

    if (!price) {
      alert("Price not found. Cannot proceed.");
      return;
    }

    const timeParts = time?.split("-");
    if (!timeParts || timeParts.length !== 2) {
      alert("Invalid time format. Please use 'HH:MM AM/PM-HH:MM AM/PM'.");
      return;
    }

    const startTime = convertTo24Hour(timeParts[0]);
    const endTime = convertTo24Hour(timeParts[1]);

    try {
      const walletRes = await fetch(`/api/wallet/${userId}`);
      const walletData = await walletRes.json();

      if (walletRes.ok && walletData.walletBalance >= price) {
        // ✅ Debit from wallet
        const debitRes = await fetch(`/api/wallet/${userId}/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "debit",
            amount: price,
            description: `You booked turf ${turfId}`,
          }),
        });

        if (debitRes.ok) {
          alert("Turf booked successfully using wallet!");

          // ✅ Prepare and send order data
          const orderData = {
            user_id: userId,
            turf_id: turfId,
            date,
            startTime,
            endTime,
            price,
            paymentStatus: "completed",
            transactionId: "",
          };

          console.log("Sending orderData to API:", orderData);

          const turfApiURL = `http://localhost:3000/api/users/exploreturf/${turfId}`;
          const postRes = await axios.post(turfApiURL, orderData);

          console.log("Order stored:", postRes.data);
        } else {
          alert("Failed to debit from wallet.");
        }
      } else {
        // ❌ Not enough balance – go to Stripe
        const response = await fetch("/api/payment/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ turfId, price, date, time }),
        });

        const { id } = await response.json();
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId: id });
      }
    } catch (error: any) {
      console.error("Error during booking:", error);
      const message =
        error?.response?.data?.error || "An error occurred while processing your booking.";
      alert(message);
    }
  };

  return (
    <button onClick={handleCheckout} className="bg-green-500 text-white p-3 rounded">
      Book Now - ₹{price}
    </button>
  );
}
