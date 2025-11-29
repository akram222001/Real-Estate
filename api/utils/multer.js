import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "mern-estate-users", // Cloudinary folder name
  },
});

const upload = multer({ storage });

export default upload;
