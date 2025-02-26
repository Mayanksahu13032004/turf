"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import Link from "next/link";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [userStorage, setUserStorage] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");
        setUserStorage(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUserStorage(null);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Both fields are required!");
      setLoading(false);
      return;
    }

    try {
      let res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Invalid credentials!");

      res = await res.json();

      localStorage.setItem("user", JSON.stringify(res));
      setUserStorage(res);

      alert("Login successful!");
      router.push("/");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat" 
         style={{ backgroundImage: "url('/turf.png')" }}>
      <div className="w-full max-w-md p-8 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Welcome Back</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-white/30 text-white border-none rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-white/30 text-white border-none rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex justify-between text-white text-sm">
            <Link href="/adminlog" className="hover:underline">Admin Login</Link>
            <Link href="/forgot-password" className="hover:underline">Forgot Password?</Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
