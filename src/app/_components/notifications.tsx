"use client";

const notifications = [
  { message: "Your booking for Turf XYZ is confirmed.", time: "10 mins ago" },
  { message: "Payment received successfully!", time: "1 hour ago" },
  { message: "Your booking for Sunday has been canceled.", time: "Yesterday" },
];

const Notifications = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Notifications</h2>
      <div className="space-y-4">
        {notifications.map((notif, index) => (
          <div key={index} className="p-4 bg-white shadow-md rounded-lg">
            <p className="text-gray-700">{notif.message}</p>
            <span className="text-sm text-gray-500">{notif.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
