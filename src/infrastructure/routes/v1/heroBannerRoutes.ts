// src/infrastructure/routes/v1/heroBannerRoutes.ts

import express from 'express';
import multer from 'multer';
import { getBanner, updateBanner } from '../../../interfaces/controllers/heroBannerController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';

const router = express.Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.get('/', getBanner);
router.put('/', authMiddleware, adminMiddleware, upload.single('image'), updateBanner);

export { router as heroBannerRouter };