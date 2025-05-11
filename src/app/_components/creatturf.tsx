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

const TurfForm: React.FC<TurfFormProps> = ({ admin }) => {
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState<ITurfForm>({
    name: "",
    location: "",
    pricePerHour: 0,
    size: "",
    surfaceType: "",
    amenities: "",
    availability: [{ day: "", startTime: "", endTime: "" }],
    createdBy: admin,
    images: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      let ev=event.target.files
      setImages((prevImages) => [...prevImages, ...Array.from(ev)]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <ToastContainer position="top-right" autoClose={2000} />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-white p-10 shadow-xl rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <h2 className="text-4xl font-bold text-center col-span-2 text-gray-800">Add New Turf</h2>

        <input
          name="name"
          type="text"
          placeholder="Turf Name"
          onChange={handleChange}
          className="p-4 border rounded-lg w-full text-lg placeholder:font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-500 transition"
        />
        <input
          name="location"
          type="text"
          placeholder="Location"
          onChange={handleChange}
          className="p-4 border rounded-lg w-full text-lg placeholder:font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-500 transition"
        />
        <input
          name="pricePerHour"
          type="number"
          placeholder="Price Per Hour"
          onChange={handleChange}
          className="p-4 border rounded-lg w-full text-lg placeholder:font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-500 transition"
        />
        <input
          name="size"
          type="text"
          placeholder="Size"
          onChange={handleChange}
          className="p-4 border rounded-lg w-full text-lg placeholder:font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-500 transition"
        />
        <input
          name="surfaceType"
          type="text"
          placeholder="Surface Type"
          onChange={handleChange}
          className="p-4 border rounded-lg w-full text-lg placeholder:font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-500 transition"
        />
        <input
          name="amenities"
          type="text"
          placeholder="Amenities (comma-separated)"
          onChange={handleChange}
          className="p-4 border rounded-lg w-full text-lg placeholder:font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-500 transition col-span-2"
        />
        
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          className="p-4 border rounded-lg w-full text-lg placeholder:font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-500 transition col-span-2"
        />

        {/* Image Previews */}
        <div className="col-span-2 mt-4">
          <h3 className="font-semibold text-xl">Selected Images</h3>
          <div className="flex space-x-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={image.name}
                  className="h-24 w-24 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full p-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-gray-700 text-white text-lg font-semibold p-4 rounded-lg w-full col-span-2 hover:bg-gray-400 hover:shadow-lg transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default TurfForm;
