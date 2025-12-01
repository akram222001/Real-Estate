// utils/multer.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Single storage configuration for all uploads
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    // Dynamic folder based on file field name
    let folder = "mern-estate";
    
    if (file.fieldname === 'avatar') {
      folder = "mern-estate-users";
    } else if (file.fieldname === 'images') {
      folder = "mern-estate-listings";
    }
    
    return {
      folder: folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: file.fieldname === 'images' 
        ? [{ width: 1000, height: 750, crop: "limit" }] 
        : [],
    };
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for all files
  }
});

export default upload;