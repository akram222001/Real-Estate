import express from 'express';
import { google, signOut, signin, signup } from '../controllers/auth.controller.js';
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/signup", upload.single("avatar"), signup);  // ⬅️ avatar upload
router.post("/signin", signin);
router.post('/google', google);
router.get('/signout', signOut)

export default router;