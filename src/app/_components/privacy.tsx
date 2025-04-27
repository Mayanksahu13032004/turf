"use client";

const Privacy = () => {
  return (
    <div className="bg-gray-300 h-[50vh] md:h-[100vh] py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 border-b pb-4">
          Privacy Policy
        </h2>

        <p className="text-lg text-gray-700 leading-relaxed text-center">
          Your privacy is important to us. This policy outlines how we **collect, use, and protect** your personal information.
        </p>

        <div className="space-y-6 mt-8 text-gray-700">
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-blue-700">1. Information Collection</h3>
            <p className="text-gray-600 leading-relaxed">
              We collect personal information such as **your name, email, and payment details** when you make a booking.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-blue-700">2. Data Protection</h3>
            <p className="text-gray-600 leading-relaxed">
              Your data is **securely stored** and is **never shared** with third parties without your consent.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-blue-700">3. Cookies</h3>
            <p className="text-gray-600 leading-relaxed">
              We use **cookies** to enhance your browsing experience and improve our services.
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

export default Privacy;
