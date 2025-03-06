"use client";
import { useState } from "react";

const faqs = [
  { question: "How do I book a turf?", answer: "You can book a turf by selecting a location, choosing an available time slot, and making a payment." },
  { question: "What payment methods do you accept?", answer: "We accept payments via credit/debit cards and UPI through our Stripe integration." },
  { question: "Can I cancel my booking?", answer: "Yes, you can cancel your booking 24 hours before your scheduled time for a full refund." },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b">
            <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex justify-between items-center py-4 text-left">
              <span className="text-lg font-medium text-gray-700">{faq.question}</span>
              <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
            </button>
            {openIndex === index && <p className="text-gray-600 pb-4">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
