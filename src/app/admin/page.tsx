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
    createdBy: Types.ObjectId;
    images?: string[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface Admin {
    id: string;
    name:string;
    date:string;
    
  }

  const AdminDashboard: React.FC = () => {

  const [activeTab, setActiveTab] = useState("dashboard");
  const [adm, setAdm] = useState("");
  const [turf, setTurf] = useState<ITurf[]>([]);
  const [order, setOrder] = useState<IOrder[]>([]);
  const router = useRouter();

  useEffect(() => {
    // ✅ Access localStorage ONLY inside useEffect
    const storedAdminId = localStorage.getItem("adminId");
    
    if (!storedAdminId) {
      toast.error("Unauthorized! Redirecting to login...");
      setTimeout(() => {
        router.push("/admin-login");
      }, 2000);
    } else {
      setAdm(storedAdminId);
      console.log("Admin ID set:", storedAdminId);
    }
  }, [router]);

  // ✅ Trigger data fetching only after adm state is set from localStorage
  useEffect(() => {
    if (adm) {
      fetchTurf();
      orderuser();
    }
  }, [adm]);
  
    const orderuser = async () => {
      try {
        if (!adm) {
          throw new Error("Admin ID is undefined or null");
        }
        
        const response = await axios.get(`http://localhost:3000/api/adminAllBookings/${adm}`);
        console.log("Response order:", response.data.result);

        if (!response.data || !Array.isArray(response.data.result)) {

          throw new Error("Invalid response format from server");
        }

        const res = response.data.result;
        console.log("res date name ",res);
        
        setOrder(res || []);

      } catch (error: any) {
        console.error("Error fetching bookings:", error);
        toast.error(error.response?.data?.message || "Failed to fetch bookings.");
      }
    };

    const fetchTurf = async () => {
      try {
        
        const response = await axios.get(`http://localhost:3000/api/adminturf/${adm}`);
        console.log(response.data);

        if (!response.data || !Array.isArray(response.data.result)) {
          throw new Error("Invalid response format from server");
        }

        const res = response.data.result;
        setTurf(res || []);

      } catch (error: any) {
        console.error("Error fetching turf:", error);
        toast.error(error.response?.data?.message || "Failed to fetch turf.");
      }
    };

    const handleLogout = () => {
      toast.success("Logging out...");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    };

    const handleDeleteTurf = async (turfId: string) => {
      if (!adm || !turfId) return;
    
      const confirm = window.confirm("Are you sure you want to delete this turf?");
      if (!confirm) return;
    
      try {
        const response = await axios.delete(`http://localhost:3000/api/adminturf/${adm}/${turfId}`);
        toast.success("Turf deleted successfully!");
        fetchTurf(); // Refresh turf list
      } catch (error: any) {
        console.error("Error deleting turf:", error);
        toast.error(error.response?.data?.message || "Failed to delete turf.");
      }
    };
   const handleUpdateClick = (turfData: ITurf) => {
    // ✅ Safe to use here because it's triggered by a user click in the browser
    localStorage.setItem("turfToUpdate", JSON.stringify(turfData)); 
    router.push(`/update?turfId=${turfData._id}`); 
  };
    
    

    return (
      <div className="flex h-screen bg-gray-50">
        <ToastContainer position="top-right" autoClose={2000} />

        <div className="w-64 bg-gray-700 text-white p-5">
          <h2 className="text-2xl font-semibold mb-6">Admin Panel</h2>
          <ul>
            <li className={`p-3 text-xl font-medium cursor-pointer ${activeTab === "dashboard" && "bg-gray-600"}`} onClick={() => setActiveTab("dashboard")}>
              Dashboard
            </li>
            <li className={`p-3 cursor-pointer text-xl font-medium ${activeTab === "turf" && "bg-gray-600"}`} onClick={() => setActiveTab("turf")}>
              My Turf
            </li>
            <li className={`p-3 cursor-pointer text-xl font-medium ${activeTab === "settings" && "bg-gray-600"}`} onClick={() => setActiveTab("settings")}>
              Create Turf
            </li>
            <li className={`p-3 cursor-pointer text-xl font-medium ${activeTab === "bookedturf" && "bg-gray-600"}`} onClick={() => setActiveTab("bookedturf")}>
              Booked Turf
            </li>
            <li className="p-3 cursor-pointer text-balck bg-gray-400 hover:bg-gray-400" onClick={handleLogout}>
              Logout
            </li>
          </ul>
        </div>

        <div className="flex-1 p-6">
          {activeTab === "dashboard" && <h2 className="text-4xl text-gray-700 text-center font-bold">Welcome to Admin Dashboard</h2>}

          {activeTab === "turf" && (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Turfs</h2>
      
      {turf && turf.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
         {turf.map((t) => (
  <div 
    key={t._id} 
    className="bg-white shadow-lg rounded-2xl overflow-hidden transform transition duration-300 hover:scale-105"
  >
    {t.images && t.images.length > 0 && (
      <img 
        src={t.images[0]} 
        alt={t.name} 
        className="w-full h-52 object-cover"
      />
    )}

    <div className="p-5">
      <h3 className="text-xl font-semibold text-gray-900">{t.name}</h3>
      <p className="text-gray-600">{t.location}</p>
      <p className="text-lg font-bold text-blue-600">₹{t.pricePerHour}/hour</p>
      
      <div className="mt-3 space-y-1 text-sm text-gray-500">
        <p><span className="font-medium text-gray-700">Size:</span> {t.size}</p>
        <p><span className="font-medium text-gray-700">Surface:</span> {t.surfaceType}</p>
        <p><span className="font-medium text-gray-700">Amenities:</span> {t.amenities?.length ? t.amenities.join(", ") : "No amenities available"}</p>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-3">
      <button
  onClick={() => handleUpdateClick(t)}
  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
>
  Update
</button>



        <button
          onClick={() => handleDeleteTurf(t._id)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
))}

        </div>
      ) : (
        <p className="text-gray-500 text-lg">No turfs found.</p>
      )}
    </div>
  )}


          {activeTab === "settings" && <TurfForm admin={adm || ""} />}

          {activeTab === "bookedturf" && (
    <div className="bg-gray-100 min-h-screen p-6">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 pb-2">Booked Turfs</h2>
      
      {order.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {order.map((o) => (
      <div key={String(o._id)} className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold text-blue-600">{o.startTime}</h3>
        <p className="text-gray-700 font-medium mt-2">Booked by: <span className="text-black font-bold">{String(o._id)}</span></p>
        <p className="text-gray-700 font-medium mt-2">Turf Booked: <span className="text-black font-bold">{((o.turf_id as unknown) as { name: string }).name}</span>
        </p>
        
        <p className="text-lg font-bold text-green-600 mt-2">Total Price: ₹{o.price}</p>
        <p className="text-sm text-gray-500 mt-2">📅 Date: <span className="font-medium">{new Date(o.date).toLocaleDateString()}</span></p>
        <p className="text-sm text-gray-500 mt-1">⏰ Time Slot: <span className="font-medium"> {o.startTime} - {o.endTime}</span></p>
        <p className="text-sm text-gray-500 mt-1">Status: <span className="font-medium">{o.paymentStatus}</span></p>
      </div>
    ))}
  </div>
) : (
  <p className="text-center text-gray-500 text-lg font-semibold mt-10">No bookings found.</p>
)}

    </div>
  )}

        </div>
      </div>
    );
  };

  export default AdminDashboard;
