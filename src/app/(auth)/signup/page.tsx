"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/users/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Invalid credentials!");

      toast.success("Sign-up successful! Redirecting...");
      setFormData({ name: "", email: "", password: "" });

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      toast.error("Sign-up failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: "url('/turf2.png')" }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="w-full max-w-md p-8 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 bg-white/30 text-white border-none rounded-lg focus:ring-2 focus:ring-green-500"
          />
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
          <div className="text-center">
            <Link href="/adminsign" className="text-green-300 hover:text-green-500 transition">
              Admin Sign In
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
