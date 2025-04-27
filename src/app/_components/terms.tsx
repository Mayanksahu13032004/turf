"use client";

const Terms = () => {
  return (
    <div className="bg-gray-300 h-[50vh] md:h-[100vh] py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 border-b pb-4">
          Terms & Conditions
        </h2>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p className="text-lg">
            By using our **turf booking system**, you agree to abide by the following terms and conditions.
          </p>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-blue-700">1. Booking Policy</h3>
            <p className="text-gray-600">
              Bookings are **confirmed only after successful payment**. Users must check availability before making a reservation.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-blue-700">2. Cancellation & Refund</h3>
            <p className="text-gray-600">
              Cancellations are allowed **up to 24 hours before the booking time**. Refunds will be processed within **5-7 business days**.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-blue-700">3. Code of Conduct</h3>
            <p className="text-gray-600">
              Players must adhere to the **turf rules** and ensure **no damage** to the property.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Last updated: <span className="font-medium">March 2025</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
