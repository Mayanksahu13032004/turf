"use client";

import { Bell } from "lucide-react";

const notifications = [
  { message: "✅ Your booking for Turf XYZ is confirmed.", time: "10 mins ago" },
  { message: "💰 Payment received successfully!", time: "1 hour ago" },
  { message: "❌ Your booking for Sunday has been canceled.", time: "Yesterday" },
];

const Notifications = () => {
  return (
    <div className="h-[50vh] md:h-[100vh] bg-gray-100 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-xl">
        <div className="flex items-center justify-center mb-8">
          <Bell className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl font-semibold text-gray-800 ml-3">Notifications</h2>
        </div>

        <div className="divide-y divide-gray-300">
          {notifications.map((notif, index) => (
            <div
              key={index}
              className="p-5 flex flex-col bg-gray-50 hover:bg-blue-50 transition-all rounded-xl shadow-md mb-4"
            >
              <p className="text-gray-800 text-lg font-medium">{notif.message}</p>
              <span className="text-sm text-gray-600">{notif.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
