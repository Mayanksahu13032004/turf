"use client";

import { useEffect, useState } from "react";
import { Copy } from "lucide-react";

export default function ReferralLink() {
  const [userId, setUserId] = useState("");
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const id = parsed?.user?._id;
        if (id) {
          setUserId(id);
          setReferralLink(`${window.location.origin}/signup?ref=${id}`);
        }
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
      }
    }
  }, []);

  const handleCopy = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      alert("Referral link copied to clipboard!");
    }
  };

  if (!userId) return null;

  return (
    <div className="mt-8 bg-gray-100 p-6 rounded-xl shadow-md border border-gray-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">🎁 Your Referral Link</h3>
      <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
        <input
          type="text"
          readOnly
          value={referralLink}
          className="flex-1 px-4 py-2 text-gray-800 bg-transparent outline-none"
        />
        <button
          onClick={handleCopy}
          className="bg-green-500 hover:bg-green-600 transition text-white px-4 py-2"
        >
          <Copy className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
