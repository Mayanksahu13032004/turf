"use client";

import { useState } from "react";
import { Clipboard, ClipboardCheck } from "lucide-react";

const Refer = () => {
  const [referralLink] = useState("https://turfbooking.com/refer/12345");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center">
      <div className="max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-lg text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">🎉 Refer & Earn</h2>
        <p className="text-gray-700 text-lg">
          Invite your friends and earn rewards when they book a turf.
        </p>

        <div className="mt-6 bg-gray-100 p-5 rounded-lg">
          <p className="text-lg font-semibold text-gray-800">Your Referral Link:</p>
          <div className="flex items-center justify-between bg-white p-3 rounded-lg mt-2 shadow-md">
            <span className="text-gray-700 truncate">{referralLink}</span>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all"
            >
              {copied ? <ClipboardCheck className="w-5 h-5" /> : <Clipboard className="w-5 h-5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Refer;
