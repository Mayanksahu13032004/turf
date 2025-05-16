"use client";

import { Bell } from "lucide-react";

const notifications = [
  { message: "✅ Your booking for Turf XYZ is confirmed.", time: "10 mins ago" },
  { message: "💰 Payment received successfully!", time: "1 hour ago" },
  { message: "❌ Your booking for Sunday has been canceled.", time: "Yesterday" },
];

const Notifications = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-300 to-gray-100 py-20 px-4">
      <div className="w-full bg-gradient-to-b from-gray-300 to-gray-100 p-10 shadow-2xl border border-gray-200">
        <div className="flex items-center justify-center mb-10 border-b pb-5">
          <Bell className="h-10 w-10 text-green-700" />
          <h2 className="text-4xl font-extrabold text-gray-800 ml-4 tracking-tight">
            Notifications
          </h2>
        </div>

        <div className="space-y-6">
          {notifications.map((notif, index) => (
            <div
              key={index}
              className="bg-gray-50 hover:bg-blue-50 transition-all p-6 rounded-xl shadow-md"
            >
              <p className="text-2xl font-bold text-gray-900">{notif.message}</p>
              <span className="text-lg text-gray-600">{notif.time}</span>
            </div>
          ))}
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500">
          Last updated: <span className="font-bold text-gray-700 text-2xl">March 2025</span>
        </footer>
      </div>
    </div>
  );
};

export default Notifications;
