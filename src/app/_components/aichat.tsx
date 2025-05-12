"use client";
import { useState, useRef, useEffect } from "react";
import { Bot, User } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! How can I help you book a turf?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        //   startTime: "2025-05-12T10:00:00.000Z",
        //   endTime: "2025-05-12T11:00:00.000Z",
          turf_id: "67b7f62ea24caca8b05d2edd",
          user_id: "681f65f22a05b68a6894d3b4",
        }),
      });

      const data = await res.json(); // ✅ FIXED

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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-blue-200">
        <h1 className="text-2xl font-bold text-blue-800 mb-4 text-center">
          🏟️ Turf Booking Assistant
        </h1>

        <div className="h-80 overflow-y-auto space-y-4 p-2 border rounded bg-white">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex items-end gap-2 max-w-xs">
                {m.role === "bot" && <Bot className="text-blue-500 w-5 h-5" />}
                <div
                  className={`p-3 rounded-lg text-sm ${
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

        <div className="flex mt-4 gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your booking request..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
