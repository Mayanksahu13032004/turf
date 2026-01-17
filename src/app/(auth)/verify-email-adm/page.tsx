"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// 1. Move the verification logic into an internal component
function VerifyAdminEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [message, setMessage] = useState("Verifying Admin Account...");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or missing verification token. Please check your admin email.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/admin-auth/verify-email?token=${token}`);
        const data = await res.json();
        
        console.log("Admin Verify Response:", res.status);

        if (!res.ok) {
          throw new Error(data.message || "Admin verification failed.");
        }

        setMessage("Admin email verified successfully! Redirecting to login...");
        
        // Redirecting to admin login page after 3 seconds
        setTimeout(() => router.push("/adminlog"), 3000);
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
        <h2 className="text-lg font-semibold text-center">{message}</h2>
      </div>
    </div>
  );
}

// 2. Export the main page with a Suspense boundary
export default function VerifyEmailAdm() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="p-6 bg-white shadow-md rounded-lg text-center">
            <h2 className="text-lg font-semibold animate-pulse">Loading Admin Verification...</h2>
          </div>
        </div>
      }
    >
      <VerifyAdminEmailContent />
    </Suspense>
  );
}