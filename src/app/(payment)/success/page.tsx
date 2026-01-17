"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Success() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");

  const [showConfetti, setShowConfetti] = useState(true);
  const [userID, setUserID] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [alreadySent, setAlreadySent] = useState(false);

  const router = useRouter();

  const getUserID = async (): Promise<string | null> => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData).user._id || JSON.parse(userData).user.id : null;
    }
    return null;
  };

  useEffect(() => {
    const fetchID = async () => {
      const id = await getUserID();
      setUserID(id);
    };
    fetchID();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const sendData = async () => {
      if (!session_id || !userID || alreadySent) return;

      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      let orderData = JSON.parse(localStorage.getItem("orderData") || "null");
      const email = userData?.user?.email;

      if (!orderData && session_id) {
        try {
          const stripeRes = await fetch(`/api/payment/stripe-session/${session_id}`);
          if (!stripeRes.ok) {
            console.error("⚠️ Stripe fetch failed:", await stripeRes.text());
            return;
          }

          const data = await stripeRes.json();
          const meta = data?.session?.metadata;
          const user = JSON.parse(localStorage.getItem("user") || "{}");
const userId = user?.user?._id || null;


          if (meta) {
            orderData = {
              user_id: userId,
              turf_id: meta.turf_id,
              date: meta.date,
              startTime: meta.startTime || meta.start_time,
              endTime: meta.endTime || meta.end_time,
              price: Number(meta.price),
              paymentStatus: "completed",
              transactionId: session_id,
            };
          }
        } catch (err) {
          console.error("💥 Failed to fetch Stripe metadata:", err);
          return;
        }
      }

      if (!orderData || !email || !orderData.turf_id) {
        console.error("❌ Missing required order data", { email, orderData });
        return;
      }

      setOrderData(orderData);

      try {
        const emailRes = await fetch("/api/payment/send-payment-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID, session_id, email }),
        });

        const emailData = await emailRes.json().catch(() => ({}));
        console.log("📧 Email sent:", emailData);
      } catch (err) {
        console.error("Email send error:", err);
      }

      try {
        const turfApiURL = `/api/users/exploreturf/${orderData.turf_id}`;
        console.log("📤 Final Order Data Being Sent:", JSON.stringify(orderData, null, 2));

        const postRes = await axios.post(turfApiURL, orderData);

        if (postRes.status === 200 || postRes.status === 201) {
          console.log("✅ Order stored:", postRes.data);
          localStorage.removeItem("orderData");
          setAlreadySent(true);
        } else {
          console.warn("⚠️ Order save failed:", postRes.status);
        }
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          const data = err.response?.data;

          console.error("❌ Axios error:");
          console.log("Message:", err.message);
          console.log("Status:", status);
          console.log("Data:", data);

          if (status === 409) {
            alert(data?.error || "This slot is already booked. Please choose another.");
          }
        } else {
          console.error("❌ Unknown error:", err);
        }
      }
    };

    sendData();
  }, [session_id, userID, alreadySent]);

  useEffect(() => {
    if (orderData) {
      console.log("✅ Order Details:", orderData);
    }
  }, [orderData]);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-200 p-6">
      {showConfetti && (
        <div className="absolute inset-0 bg-[url('/confetti.svg')] bg-cover bg-center animate-fade opacity-30"></div>
      )}

      <div className="relative bg-white shadow-2xl rounded-3xl p-10 max-w-2xl w-full text-center border border-gray-300">
        <h1 className="text-4xl font-extrabold text-green-600 mb-6">🎉 Payment Successful!</h1>
        <p className="text-lg text-gray-700 font-medium">
          Thank you for your booking. Your payment has been successfully processed.
        </p>

        {session_id && (
          <p className="mt-5 text-sm text-gray-700 bg-gray-100 py-3 px-5 rounded-md border border-gray-300">
            <span className="font-semibold">Session ID:</span> {session_id}
          </p>
        )}

        <div className="mt-8 flex flex-col md:flex-row justify-center gap-6">
          <button
            onClick={() => router.push("/")}
            className="w-full md:w-auto px-8 py-4 bg-green-500 text-white text-lg rounded-lg shadow-md hover:bg-green-600 transition-all"
          >
            Return to Home
          </button>

          <button
            onClick={() => router.push(`/user/allbookings/${userID}`)}
            className="w-full md:w-auto px-8 py-4 bg-blue-500 text-white text-lg rounded-lg shadow-md hover:bg-blue-600 transition-all"
          >
            View All Bookings
          </button>
        </div>
      </div>
    </div>
  );
}
