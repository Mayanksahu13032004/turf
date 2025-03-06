"use client";

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-extrabold text-center text-gray-900 mb-12">
          About Us
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome to <span className="font-semibold text-blue-600">TurfEase</span>, 
              your trusted platform for hassle-free <span className="font-semibold">turf bookings</span>.
              We provide an intuitive way for sports lovers, teams, and event organizers to 
              book high-quality turfs for their matches and events.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Whether you're looking for a <span className="font-semibold">football, cricket, or multi-purpose turf</span>, 
              we ensure **real-time availability, AI-driven suggestions, and dynamic pricing**. 
              Our goal is to **redefine sports facility management** and deliver an unparalleled booking experience.
            </p>
          </div>

          <div className="relative">
            <img 
              src="/images/turf-about.jpg" 
              alt="Turf Booking System" 
              className="rounded-xl shadow-xl transform hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent rounded-xl opacity-50"></div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold text-gray-900">Why Choose Us?</h3>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <h4 className="text-xl font-semibold text-blue-600">🚀 Easy Booking</h4>
              <p className="text-gray-600 mt-2">Book your preferred turf effortlessly with a few simple clicks.</p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <h4 className="text-xl font-semibold text-blue-600">🤖 AI-Powered System</h4>
              <p className="text-gray-600 mt-2">Enjoy **personalized recommendations** based on past bookings.</p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <h4 className="text-xl font-semibold text-blue-600">💳 Secure Payments</h4>
              <p className="text-gray-600 mt-2">Make fast and secure transactions with **Stripe integration**.</p>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold text-gray-900">Join Our Community</h3>
          <p className="text-lg text-gray-700 mt-4 max-w-3xl mx-auto">
            Be a part of our expanding **sports community**. Start booking today and 
            **experience the future of turf management** like never before!
          </p>
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-full shadow-lg hover:bg-blue-700 transition duration-300">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
