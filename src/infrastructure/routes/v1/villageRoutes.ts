// src/infrastructure/routes/v1/villageRoutes.ts

import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import {
  getVillageInfo,
  updateVillageInfo,
  getVillageStructure,
  createVillageStructure,
  updateVillageStructure,
  deleteVillageStructure,
  getGallery,
  addGalleryImage,
  deleteGalleryImage,
  getSocialMedia,
  updateSocialMedia,
} from "../../../interfaces/controllers/villageController";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { adminMiddleware } from "../../middlewares/adminMiddleware";

const router = express.Router();

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Konfigurasi Multer untuk menyimpan file di memori
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Fungsi untuk mengupload file ke Cloudinary
const uploadToCloudinary = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "village_gallery" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

// Public routes
router.get("/info", getVillageInfo);
router.get("/structure", getVillageStructure);
router.get("/gallery", getGallery);
router.get("/social-media", getSocialMedia);

// Admin-only routes
router.put("/info", authMiddleware, adminMiddleware, updateVillageInfo);
router.post(
  "/structure",
  authMiddleware,
  adminMiddleware,
  createVillageStructure
);
router.put(
  "/structure/:id",
  authMiddleware,
  adminMiddleware,
  updateVillageStructure
);
router.delete(
  "/structure/:id",
  authMiddleware,
  adminMiddleware,
  deleteVillageStructure
);

router.post(
  "/gallery",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }
      const imageUrl = await uploadToCloudinary(req.file);
      const description = req.body.description as string | undefined;
      await addGalleryImage(req, res, next, imageUrl, description);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/gallery/:id",
  authMiddleware,
  adminMiddleware,
  deleteGalleryImage
);
router.put(
  "/social-media/:id",
  authMiddleware,
  adminMiddleware,
  updateSocialMedia
);

export { router as villageRouter };
