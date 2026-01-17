"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// 1. This internal component handles the searchParams and API logic
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    // If no token is present in the URL, prompt the user to check their mail
    if (!token) {
      setMessage("Please check your Gmail. A verification link has been sent to your account.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/users/verify-email?token=${token}`);
        const data = await res.json();
        
        console.log("Response Status:", res.status);

        if (!res.ok) {
          throw new Error(data.message || "Verification failed.");
        }

        setMessage("Email verified successfully! Redirecting to home...");
        
        // Redirect to the home page after 3 seconds
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
        <h2 className="text-lg font-semibold text-center text-gray-800">
          {message}
        </h2>
      </div>
    </div>
  );
}

// 2. Main Page export wrapped in Suspense to prevent build errors
export default function VerifyEmail() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold animate-pulse">
              Loading verification status...
            </h2>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}