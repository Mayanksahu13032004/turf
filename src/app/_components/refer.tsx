"use client";
import { useState } from "react";

const Refer = () => {
  const [referralLink] = useState("https://turfbooking.com/refer/12345");

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Refer & Earn</h2>
      <p className="text-gray-700">Invite your friends and earn rewards when they book a turf.</p>
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <p className="text-lg font-semibold">Your Referral Link:</p>
        <div className="bg-white p-2 rounded-lg mt-2 flex justify-between items-center">
          <span className="text-gray-800">{referralLink}</span>
          <button
            onClick={() => navigator.clipboard.writeText(referralLink)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Refer;
