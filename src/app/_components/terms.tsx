"use client";

const Terms = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-300 to-gray-100 py-20 px-4">
      <div className="w-fullbg-gradient-to-b from-gray-300 to-gray-100 p-10 shadow-2xl rounded-none border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-tight border-b pb-5">
          Terms & Conditions
        </h2>

        <div className="space-y-10 text-gray-900 text-2xl leading-relaxed">
          <p className="text-4xl font-bold">
            By using our <span className="text-black text-4xl">turf booking system</span>, you agree to abide by the following terms and conditions.
          </p>

          <section>
            <h3 className="text-2xl text-green-700 mb-2 font-bold">1. Booking Policy</h3>
            <p className="text-2xl font-bold">
              Bookings are <span className="text-black">confirmed only after successful payment</span>. Please check availability before making a reservation.
            </p>
          </section>

          <section>
            <h3 className="text-2xl text-green-700 mb-2 font-bold">2. Cancellation & Refund</h3>
            <p className="text-2xl font-bold">
              Cancellations are allowed <span className="text-black">up to 24 hours before the booking time</span>. Refunds will be processed within <span className="text-black">5–7 business days</span>.
            </p>
          </section>

          <section>
            <h3 className="text-2xl text-green-700 mb-2 font-bold">3. Code of Conduct</h3>
            <p className="text-2xl font-bold">
              Players must follow all <span className="text-black">turf rules</span> and ensure <span className="text-black">no damage</span> is caused to the facility.
            </p>
          </section>
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500">
          Last updated: <span className="font-bold text-gray-700 text-2xl">March 2025</span>
        </footer>
      </div>
    </div>
  );
};

export default Terms;
