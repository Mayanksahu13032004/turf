"use client";

import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ITurfForm {
  name: string;
  location: string;
  pricePerHour: number;
  size: string;
  surfaceType: string;
  amenities: string;
  availability: { day: string; startTime: string; endTime: string }[];
  createdBy: string;
  images: File[];
}
interface TurfFormProps {
  admin: string;
}
const TurfForm: React.FC<TurfFormProps> = ({ admin }) =>{
    const [images, setImages] = useState<File[]>([]);

  const [formData, setFormData] = useState<ITurfForm>({
    name: "",
    location: "",
    pricePerHour: 0,
    size: "",
    surfaceType: "",
    amenities: "",
    availability: [{ day: "", startTime: "", endTime: "" }],
    createdBy: admin, // Hardcoded for now
    images: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(Array.from(event.target.files)); // Convert FileList to array
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("location", formData.location);
      data.append("pricePerHour", formData.pricePerHour.toString());
      data.append("size", formData.size);
      data.append("surfaceType", formData.surfaceType);
      data.append("amenities", formData.amenities);
      data.append("createdBy", formData.createdBy);
  
      formData.availability.forEach((item, index) => {
        data.append(`availability[${index}][day]`, item.day);
        data.append(`availability[${index}][startTime]`, item.startTime);
        data.append(`availability[${index}][endTime]`, item.endTime);
      });
  
      // ✅ Fix: Append images from `images` state instead of `formData.images`
      images.forEach((image) => {
        data.append("images", image);
      });
  
      const response = await axios.post(
        `http://localhost:3000/api/adminturf/${admin}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      toast.success("Turf added successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      toast.error("Failed to add turf.");
      console.error("Error:", error);
    }
  };
  
  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 shadow-md rounded-lg">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2 className="text-2xl font-bold mb-4">Add New Turf</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" type="text" placeholder="Turf Name" onChange={handleChange} className="w-full p-2 mb-2 border" />
        <input name="location" type="text" placeholder="Location" onChange={handleChange} className="w-full p-2 mb-2 border" />
        <input name="pricePerHour" type="number" placeholder="Price Per Hour" onChange={handleChange} className="w-full p-2 mb-2 border" />
        <input name="size" type="text" placeholder="Size" onChange={handleChange} className="w-full p-2 mb-2 border" />
        <input name="surfaceType" type="text" placeholder="Surface Type" onChange={handleChange} className="w-full p-2 mb-2 border" />
        <input name="amenities" type="text" placeholder="Amenities (comma-separated)" onChange={handleChange} className="w-full p-2 mb-2 border" />
        <input type="file" multiple onChange={handleImageChange} className="w-full p-2 mb-2 border" />
        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded-md">Submit</button>
      </form>
    </div>
  );
};

export default TurfForm;
