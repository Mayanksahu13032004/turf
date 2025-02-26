"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const AdminSignup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/admin-auth/sign-up", formData);
      toast.success("Signup successful! Redirecting...");
      setFormData({ name: "", email: "", password: "" });

      setTimeout(() => {
        router.push("/adminlogin");
      }, 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: "url('/turf2.png')" }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="w-full max-w-md p-8 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Admin Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 bg-white/30 text-white border-none rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-white/30 text-white border-none rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 bg-white/30 text-white border-none rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-center">
            <Link href="/adminlog" className="text-blue-300 hover:text-blue-500 transition">
              Already have an account? Log in
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
