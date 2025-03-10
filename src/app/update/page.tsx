"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateTurfPage = () => {
  const searchParams = useSearchParams();
  const turfId = searchParams.get("turfId");
  const [createdBy, setCreatedBy] = useState("");

  
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    pricePerHour: "",
    size: "",
    surfaceType: "",
    amenities: "",
  });



  useEffect(() => {
    const storedTurf = localStorage.getItem("turfToUpdate");
    if (storedTurf) {
      const parsedTurf = JSON.parse(storedTurf);
      if (parsedTurf._id === turfId) {
        setFormData({
          name: parsedTurf.name,
          location: parsedTurf.location,
          pricePerHour: parsedTurf.pricePerHour,
          size: parsedTurf.size,
          surfaceType: parsedTurf.surfaceType,
          amenities: parsedTurf.amenities?.join(", "),
        });
        setCreatedBy(parsedTurf.createdBy);
      }
    }
  }, [turfId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await axios.patch(`http://localhost:3000/api/adminturf/${createdBy}/${turfId}`, {
            ...formData,
            amenities: formData.amenities.split(",").map((a) => a.trim()),
          });
          
      toast.success("Turf updated successfully!");
      router.push("/admin");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update turf.");
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Update Turf</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Turf Name"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="number"
            name="pricePerHour"
            value={formData.pricePerHour}
            onChange={handleChange}
            placeholder="Price Per Hour"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            placeholder="Size"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            name="surfaceType"
            value={formData.surfaceType}
            onChange={handleChange}
            placeholder="Surface Type"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="Amenities (comma separated)"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg"
          >
            Update Turf
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTurfPage;
