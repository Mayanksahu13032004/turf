"use client";

const Privacy = () => {
  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Privacy Policy</h2>
      <p className="text-gray-700">
        Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal information.
      </p>
      <div className="space-y-6 mt-6">
        <h3 className="text-xl font-semibold">1. Information Collection</h3>
        <p>We collect information such as your name, email, and payment details when you make a booking.</p>
        <h3 className="text-xl font-semibold">2. Data Protection</h3>
        <p>Your data is securely stored and is not shared with third parties without consent.</p>
        <h3 className="text-xl font-semibold">3. Cookies</h3>
        <p>We use cookies to enhance your experience on our website.</p>
      </div>
    </div>
  );
};

export default Privacy;
