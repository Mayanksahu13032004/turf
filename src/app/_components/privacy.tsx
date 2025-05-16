"use client";

const Privacy = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-300 to-gray-100 py-20 px-4">
      <div className="w-full bg-gradient-to-b from-gray-300 to-gray-100 p-10 shadow-2xl border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-tight border-b pb-5">
          Privacy Policy
        </h2>

        <p className="text-2xl text-gray-900 leading-relaxed font-bold mb-10 text-center">
          Your privacy is important to us. This policy outlines how we <span className="text-black">collect, use, and protect</span> your personal information.
        </p>

        <div className="space-y-10 text-gray-900 text-2xl leading-relaxed">
          <section>
            <h3 className="text-2xl text-green-700 mb-2 font-bold">1. Information Collection</h3>
            <p className="text-2xl font-bold">
              We collect personal information such as <span className="text-black">your name, email, and payment details</span> when you make a booking.
            </p>
          </section>

          <section>
            <h3 className="text-2xl text-green-700 mb-2 font-bold">2. Data Protection</h3>
            <p className="text-2xl font-bold">
              Your data is <span className="text-black">securely stored</span> and is <span className="text-black">never shared</span> with third parties without your consent.
            </p>
          </section>

          <section>
            <h3 className="text-2xl text-green-700 mb-2 font-bold">3. Cookies</h3>
            <p className="text-2xl font-bold">
              We use <span className="text-black">cookies</span> to enhance your browsing experience and improve our services.
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

export default Privacy;
