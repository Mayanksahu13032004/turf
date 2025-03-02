"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or missing verification token.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/users/verify-email?token=${token}`);
        const data = await res.json();
    console.log(res)
        if (!res.ok) {
          throw new Error(data.message || "Verification failed.");
        }
    
        setMessage("Email verified successfully! Redirecting...");
        
        setTimeout(() => router.push("/"), 3000);
      } catch (error) {
        if (error instanceof Error) {
          setMessage(error.message);
        } else {
          setMessage("An unknown error occurred.");
        }
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-lg font-semibold">{message}</h2>
      </div>
    </div>
  );
}
