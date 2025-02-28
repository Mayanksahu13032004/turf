"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Types } from "mongoose";
import TurfForm from "../_components/creatturf";
import { IOrder } from "../model/order";


export interface ITurf {
  _id: string;
  name: string;
  location: string;
  pricePerHour: number;
  size: string;
  surfaceType: string;
  amenities: string[];
  availability: { day: string; startTime: string; endTime: string }[];
  createdBy: Types.ObjectId; // Admin who created the turf
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Admin {
  id: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [adm, setAdm] = useState<Admin | null>(null);
  const [turf, setTurf] = useState<ITurf[]>([]);
  const [order, setOrder] = useState<IOrder[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedAdminId: string | null = localStorage.getItem("adminId");

    if (!storedAdminId) {
      toast.error("Unauthorized! Redirecting to login...");
      setTimeout(() => {
        router.push("/admin-login");
      }, 2000);
    } else {
      setAdm({ id: storedAdminId });
      console.log("Admin ID:", storedAdminId);
    }
  }, [router]);

  useEffect(() => {
    if (adm?.id) {
      fetchTurf();
      orderuser();
    }
  }, [adm]);



  const orderuser = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/adminAllBookings/67c1d7b80bb8ddbd528b7efe");
      console.log("Response order:", response.data.result);
  
      if (!response.data || !Array.isArray(response.data.result)) {
        throw new Error("Invalid response format from server");
      }
  
      const res=response.data.result

      setOrder( res|| null);
      
    } catch (error) {
      console.error("Error fetching turf:", error);
      toast.error("Failed to fetch turf.");
    }
  };




  const fetchTurf = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/adminturf/67c1d7b80bb8ddbd528b7efe");
      console.log("Response:", response.data.result);
  
      if (!response.data || !Array.isArray(response.data.result)) {
        throw new Error("Invalid response format from server");
      }
  
      const res=response.data.result

      setTurf( res|| null);
      
    } catch (error) {
      console.error("Error fetching turf:", error);
      toast.error("Failed to fetch turf.");
    }
  };
  
  
  const handleLogout = () => {
    toast.success("Logging out...");
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-5">
        <h2 className="text-2xl font-semibold mb-6">Admin Panel</h2>
        <ul>
          <li className={`p-3 cursor-pointer ${activeTab === "dashboard" && "bg-blue-700"}`} onClick={() => setActiveTab("dashboard")}>
            Dashboard
          </li>
          <li className={`p-3 cursor-pointer ${activeTab === "turf" && "bg-blue-700"}`} onClick={() => setActiveTab("turf")}>
            My Turf
          </li>
          <li className={`p-3 cursor-pointer ${activeTab === "settings" && "bg-blue-700"}`} onClick={() => setActiveTab("settings")}>
            create turf
          </li>
          <li className={`p-3 cursor-pointer ${activeTab === "bookedturf" && "bg-blue-700"}`} onClick={() => setActiveTab("bookedturf")}>
            booked turf
          </li>
          <li className="p-3 cursor-pointer bg-red-600 hover:bg-red-700" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === "dashboard" && <h2 className="text-2xl font-bold">Welcome to Admin Dashboard</h2>}

        {activeTab === "turf" && (
  <div>
    <h2 className="text-2xl font-bold mb-4">My Turfs</h2>
    {turf && turf.length > 0 ? (
      turf.map((t) => (
        <div key={t._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
          {t.images && t.images.length > 0 && (
            <img src={t.images[0]} alt={t.name} className="w-full h-40 object-cover rounded-md mb-3" />
          )}
          <h3 className="text-xl font-semibold">{t.name}</h3>
          <p className="text-gray-600">{t.location}</p>
          <p className="text-gray-900 font-bold">₹{t.pricePerHour}/hour</p>
          <p className="text-sm text-gray-500">Size: {t.size}</p>
          <p className="text-sm text-gray-500">Surface: {t.surfaceType}</p>
          <p className="text-sm text-gray-500">
            Amenities: {t.amenities?.length ? t.amenities.join(", ") : "No amenities available"}
          </p>
        </div>
      ))
    ) : (
      <p>No turfs found.</p>
    )}
  </div>
)}


        {activeTab === "settings" && <h2 className="text-2xl font-bold"><TurfForm admin={adm?.id || ""} />
        </h2>}

        {activeTab === "bookedturf" && (
  <div>
    <h2 className="text-2xl font-bold mb-4">Booked Turfs</h2>
    { order.length > 0 ? (
      order.map((o) => (
        <div key={String(o._id)} className="bg-white shadow-md rounded-lg p-4 mb-4">
          <h3 className="text-xl font-semibold">{o.startTime}</h3>
          <p className="text-gray-600">Booked by: </p>
          <p className="text-gray-900 font-bold">Total Price: ₹{o.price}</p>
          <p className="text-sm text-gray-500">Date: </p>
          <p className="text-sm text-gray-500">Time Slot: {o.endTime}</p>
        </div>
      ))
    ) : (
      <p>No bookings found.</p>
    )}
  </div>
)}

      </div>
    </div>
  );
};

export default AdminDashboard;
