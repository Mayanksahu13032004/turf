'use client';

import { useState, useRef, useEffect } from "react";
import { Bot, User } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Chatbot states
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! How can I help you book a turf?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          price: 1000,
          turf_id: "67b7f62ea24caca8b05d2edd",
          user_id: "681f65f22a05b68a6894d3b4",
        }),
      });

      const data = await res.json();

      if (res.ok && data?.response) {
        setMessages((prev) => [...prev, { role: "bot", text: data.response }]);

        if (data.checkoutUrl) {
          setTimeout(() => {
            window.location.href = data.checkoutUrl;
          }, 1500);
        }
      } else {
        throw new Error(data?.error || "Invalid response from server");
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "❌ Sorry, there was an issue: " + error.message,
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-full shadow-lg flex items-center space-x-2 z-50"
        aria-label="Toggle AI Chatbot"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-7 4h8a2 2 0 002-2v-5a2 2 0 00-2-2h-8a2 2 0 00-2 2v5a2 2 0 002 2z"
          />
        </svg>
        <span>Ask AI Mentor</span>
      </button>

      {/* Chatbot popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-8 w-[360px] max-w-full h-[600px] bg-gradient-to-br from-blue-100 via-white to-blue-200 rounded-xl shadow-2xl border border-blue-300 z-50 flex flex-col">
          <div className="bg-white/80 backdrop-blur-md rounded-t-xl p-4 border-b border-blue-200 flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-800">🏟️ Turf Booking Assistant</h1>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Chatbot"
              className="text-blue-700 hover:text-blue-900 font-bold text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white shadow-inner rounded-b-xl">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-end gap-2 max-w-[75%]">
                  {m.role === "bot" && <Bot className="text-blue-500 w-5 h-5" />}
                  <div
                    className={`p-3 rounded-xl text-base ${
                      m.role === "bot"
                        ? "bg-blue-100 text-blue-900"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.role === "user" && <User className="text-blue-600 w-5 h-5" />}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-4 p-4 bg-white border-t border-blue-200 rounded-b-xl">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your booking request..."
              className="flex-1 px-5 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all text-base font-medium"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
