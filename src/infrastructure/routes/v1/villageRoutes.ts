// src/infrastructure/routes/v1/villageRoutes.ts

import express from "express";
import multer from "multer";
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
const upload = multer({ dest: "uploads/" });

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
  (req, res, next) => {
    addGalleryImage(req, res, next).catch(next);
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
