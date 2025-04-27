


"use client";
import SectionHeader from "../../_components/SectionHeader";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-lg p-10">
      <SectionHeader 
        title="About us" 
        subtitle="We’d love to hear from you!" 
      />
        <p className="text-gray-700 leading-relaxed mb-4 text-justify">
          Welcome to <span className="font-semibold text-green-500">Turf Booking</span> — your one-stop solution for 
          hassle-free sports ground booking. Our mission is to simplify your experience, whether you want 
          to book a football turf, a cricket ground, or any sports arena!
        </p>
        <p className="text-gray-700 leading-relaxed mb-4 text-justify">
          We believe that playing sports should be spontaneous and easy, not a stressful chore. Our platform 
          connects you with the best available grounds at the best prices — quick, smooth, and transparent.
        </p>
        <p className="text-gray-700 leading-relaxed text-justify">
          Made with ❤️ by passionate players, for passionate players.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;

  
  
