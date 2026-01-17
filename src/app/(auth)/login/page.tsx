"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
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
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 200) {
        if (!data.user.verified) {
          toast.warn("Please verify your email before logging in.");
        } else {
          localStorage.setItem("user", JSON.stringify(data));
          toast.success("Login successful! Redirecting...");
          setTimeout(() => {
            router.push("/");
             setTimeout(() => {
            window.location.reload();

            
          }, 2000);


          }, 3000);
        }
      } else {
        throw new Error(data.error || "Invalid credentials.");
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen  bg-slate-600 flex justify-center items-center">
      {/* Embedding the Visme animation */}
      <iframe
        src="https://forms.visme.co/formsPlayer/76j1o8gz-simple-newsletter-subscription"
        className="absolute w-full h-full border-none"
      ></iframe>

      {/* Login Form Over the Animation */}
      <div className="relative z-20 w-full  bg-slate-600 max-w-md ml-10 p-8  mt-28 rounded-2xl shadow-xl ">
        <ToastContainer position="top-right" autoClose={2000} />
        <h2 className="text-3xl font-bold text-white text-center mb-4">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3   text-black border-none rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 text-black border-none rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <div className="flex justify-between text-white text-sm">
            <Link href="/adminlog" className="hover:underline text-xl font-bold">
              Admin Login
            </Link>
            <Link href="/forgot-password" className="hover:underline text-xl font-bold">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 text-white bg-slate-400 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
