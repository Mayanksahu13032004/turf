"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminSign() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      const res = await fetch("http://localhost:3000/api/admin-auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 201) {
        toast.success("Sign-up successful! Please verify your email.");
        setFormData({ name: "", email: "", password: "" });

        setTimeout(() => {
          router.push("/verify-email-adm");
        }, 2000);
      } else {
        throw new Error(data.error || "Sign-up failed.");
      }
    } catch (err: any) {
      toast.error(err.message || "Sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/turf2.png')" }}
    >
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white/20 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden">
        {/* Left Side - Welcome Text */}
        <div className="hidden md:flex flex-col justify-center bg-black/40 text-white p-10 w-full md:w-1/2">
          <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
          <p className="text-sm mb-4">
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
          </p>
          <div className="flex space-x-4">
            <i className="fab fa-facebook-f text-xl hover:text-gray-300"></i>
            <i className="fab fa-twitter text-xl hover:text-gray-300"></i>
            <i className="fab fa-instagram text-xl hover:text-gray-300"></i>
            <i className="fab fa-youtube text-xl hover:text-gray-300"></i>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full md:w-1/2 p-8 bg-white/30">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="text-right text-sm">
              <Link href="/adminsign" className="text-green-700 hover:underline">
                Already have an account?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
