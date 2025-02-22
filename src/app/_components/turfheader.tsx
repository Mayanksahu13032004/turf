"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const router = useRouter(); // Initialize useRouter

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/api/admin-auth/sign-up", formData);
      toast.success("Signup successful! Redirecting...");
      setFormData({ name: "", email: "", password: "" }); // Reset form

      // Redirect after a short delay (so the user sees the success message)
      setTimeout(() => {
        router.push("/"); // Redirect to home page
      }, 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Admin Signup</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
