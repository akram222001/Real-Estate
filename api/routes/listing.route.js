import express from 'express';
import { 
  createListing, 
  deleteListing, 
  updateListing, 
  getListing, 
  getListings,
  uploadImages 
} from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import upload from '../utils/multer.js'; // Same upload as users

const router = express.Router();

router.post('/upload-images', verifyToken, upload.array('images', 6), uploadImages);
router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

export default router;