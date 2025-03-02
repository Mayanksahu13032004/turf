"use client";

import { useState, useEffect } from "react";
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
  
      // Check if the response is ok (status 200-299)
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
        localStorage.setItem("user", JSON.stringify(data)); // Store the full response with adminId
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
      setLoading(false); // Reset the loading state after the request is done
    }};

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/turf.png')" }}
    >
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="w-full max-w-md p-8 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-white/30 text-white border-none rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 bg-white/30 text-white border-none rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <div className="flex justify-between text-white text-sm">
           
            <Link href="/forgot-password" className="hover:underline">
              Forgot Password?
            </Link>
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
