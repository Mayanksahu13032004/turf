"use client";

const Privacy = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-start justify-center py-20 px-4">
      <div className="w-full max-w-4xl bg-white p-10 shadow-2xl rounded-2xl border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-tight border-b pb-5">
          Privacy Policy
        </h2>

        <p className="text-lg text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
          Your privacy is important to us. This policy outlines how we <span className="font-semibold">collect, use, and protect</span> your personal information.
        </p>

        <div className="space-y-10 mt-10 text-gray-700">
          <section>
            <h3 className="text-2xl font-semibold text-green-700 mb-2">1. Information Collection</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              We collect personal information such as <span className="font-medium">your name, email, and payment details</span> when you make a booking.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-green-700 mb-2">2. Data Protection</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              Your data is <span className="font-medium">securely stored</span> and is <span className="font-medium">never shared</span> with third parties without your consent.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-green-700 mb-2">3. Cookies</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              We use <span className="font-medium">cookies</span> to enhance your browsing experience and improve our services.
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

export default Privacy;
