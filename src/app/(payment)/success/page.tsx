"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Success() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");

  const [showConfetti, setShowConfetti] = useState(true);
  const router = useRouter();

  const getUserID = (): string | null => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData).user._id || JSON.parse(userData).user.id : null;
    }
    return null;
  };

  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    setUserID(getUserID());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000); // Hide confetti after 3 sec
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (session_id && userID) {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const email = userData?.user?.email; // Get email from localStorage
  
      if (!email) {
        console.error("Error: Email is missing");
        return; // Prevent API call if email is missing
      }
  
      fetch("/api/payment/send-payment-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID, session_id, email }), // Include email
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json().catch(() => ({})); // Ensure valid JSON or empty object
        })
        .then((data) => console.log("Email sent:", data))
        .catch((err) => console.error("Email send error:", err));
    }
  }, [session_id, userID]);
  
  
  

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-200 p-6">
      {/* Animated Confetti Background */}
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












