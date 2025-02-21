import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import "@/lib/cloudinary"; // Ensure Cloudinary is configured first

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
//   params: {
//     folder: "turf-images",
//     format: "png", // Directly set format as "png" instead of an async function
//     public_id: (req, file) => `turf_${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`, // Ensure unique filename
//     transformation: [{ width: 800, height: 600, crop: "limit" }],
//   },
});

// Multer instance
const upload = multer({ storage });

export default upload;
