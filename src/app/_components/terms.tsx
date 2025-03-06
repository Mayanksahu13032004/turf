"use client";

const Terms = () => {
  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Terms & Conditions</h2>
      <div className="space-y-6 text-gray-700">
        <p>By using our turf booking system, you agree to abide by the following terms and conditions.</p>
        <h3 className="text-xl font-semibold">1. Booking Policy</h3>
        <p>Bookings are confirmed only after successful payment. Users must check the availability before making a reservation.</p>
        <h3 className="text-xl font-semibold">2. Cancellation & Refund</h3>
        <p>Cancellation is allowed up to 24 hours before the booking time. Refunds will be processed within 5-7 business days.</p>
        <h3 className="text-xl font-semibold">3. Code of Conduct</h3>
        <p>Players must adhere to the turf rules and ensure no damage to the property.</p>
      </div>
    </div>
  );
};

export default Terms;
