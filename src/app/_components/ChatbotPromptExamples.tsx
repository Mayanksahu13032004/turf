"use client";

export default function ChatbotPromptExamples() {
  const greetings = [
    "Hi",
    "Hello",
    "Hey",
    "Thanks, that's all",
  ];

  const locationQueries = [
    "Show turf in Indore",
    "Any turf in Bangalore?",
    "Turf options in Mumbai",
    "Find turf in Delhi",
    "Are there any turf in Hyderabad?",
    "Show me turfs in Gujarat",
  ];

  const bookingRequests = [
    "Book Scrim Crowm on 2025-06-10 at 2:00 PM - 4:00 PM",
    "I want to book Turf XYZ on 2025-05-20 at 5 PM",
    "Which turfs are available on 2025-05-17 at 11 AM?",
  ];

  return (
    <div className="w-full bg-gradient-to-b from-gray-300 to-gray-100 shadow-md rounded-md p-6">
      <h2 className="text-4xl text-center font-bold mb-6 text-black-700">Chatbot Example Prompts</h2>

      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-3 text-gray-900">Greetings & General</h1>
        <ul className="list-disc list-inside space-y-2 text-gray-800">
          {greetings.map((prompt, i) => (
            <li
              key={i}
              className="cursor-text text-2xl font-bold select-text hover:text-blue-600 transition"
            >
              {prompt}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-3 text-gray-900">Location Queries</h1>
        <ul className="list-disc list-inside space-y-2 text-gray-800">
          {locationQueries.map((prompt, i) => (
            <li
              key={i}
              className="cursor-text text-2xl font-bold select-text hover:text-blue-600 transition"
            >
              {prompt}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h1 className="text-3xl font-bold mb-3 text-gray-900">Booking Requests</h1>
        <ul className="list-disc list-inside space-y-2 text-gray-800">
          {bookingRequests.map((prompt, i) => (
            <li
              key={i}
              className="cursor-text text-2xl font-bold select-text hover:text-blue-600 transition"
            >
              {prompt}
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-6 text-sm text-gray-500">
        Use these example prompts to interact with the turf booking chatbot effectively.
      </p>
    </div>
  );
}
