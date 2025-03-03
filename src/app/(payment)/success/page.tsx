"use client";

import { useSearchParams ,useRouter} from "next/navigation";
import { useEffect, useState } from "react";

export default function Success() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");

  const [showConfetti, setShowConfetti] = useState(true);
  const router=useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000); // Hide confetti after 3 sec
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      {showConfetti && <div className="absolute top-0 left-0 w-full h-full bg-[url('/confetti.svg')] bg-cover opacity-30"></div>}
      
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-3">🎉 Payment Successful!</h1>
        <p className="text-gray-700">Thank you for your booking. Your payment has been successfully processed.</p>
        
        {session_id && (
          <p className="mt-4 text-sm text-gray-500 bg-gray-200 p-2 rounded-md">
            <span className="font-semibold">Session ID:</span> {session_id}
          </p>
        )}

        <button 
          onClick={() => router.push("/")} 
          className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
