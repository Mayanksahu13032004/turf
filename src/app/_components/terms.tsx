"use client";

const Terms = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-start justify-center py-20 px-4">
      <div className="w-full max-w-4xl bg-white p-10 shadow-2xl rounded-2xl border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-tight border-b pb-5">
          Terms & Conditions
        </h2>

        <div className="space-y-10 text-gray-700 leading-relaxed">
          <p className="text-lg">
            By using our <span className="font-semibold text-black">turf booking system</span>, you agree to abide by the following terms and conditions.
          </p>

          <section>
            <h3 className="text-2xl font-semibold text-green-700 mb-2">1. Booking Policy</h3>
            <p className="text-base text-gray-600">
              Bookings are <span className="font-medium">confirmed only after successful payment</span>. Please check availability before making a reservation.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-green-700 mb-2">2. Cancellation & Refund</h3>
            <p className="text-base text-gray-600">
              Cancellations are allowed <span className="font-medium">up to 24 hours before the booking time</span>. Refunds will be processed within <span className="font-medium">5–7 business days</span>.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-green-700 mb-2">3. Code of Conduct</h3>
            <p className="text-base text-gray-600">
              Players must follow all <span className="font-medium">turf rules</span> and ensure <span className="font-medium">no damage</span> is caused to the facility.
            </p>
          </section>
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500">
          Last updated: <span className="font-medium text-gray-700">March 2025</span>
        </footer>
      </div>
    </div>
  );
};

export default Terms;
