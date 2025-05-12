"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("Both fields are required!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/admin-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Invalid credentials.");
      }

      const data = await res.json();

      if (!data.adminId) {
        throw new Error("No admin data found in the response.");
      }

      if (!data.adminId.verified) {
        toast.warn("Please verify your email before logging in.");
      } else {
        localStorage.setItem("user", JSON.stringify(data));
        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/admin");
        }, 2000);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Login failed. Please try again.");
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center" style={{ backgroundImage: "url('/turf.png')" }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/30">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome back 👋</h2>
        <p className="text-white text-sm mb-6">Welcome back! Please enter your details.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full p-3 rounded-lg bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-green-500 outline-none"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full p-3 rounded-lg bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-green-500 outline-none"
          />
          <div className="flex justify-end text-sm text-white">
            <Link href="/forgot-password" className="hover:underline">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-medium transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
