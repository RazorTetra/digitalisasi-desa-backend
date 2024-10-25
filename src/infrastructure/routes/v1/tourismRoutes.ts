// src/infrastructure/routes/v1/tourismRoutes.ts

import express from 'express';
import multer from 'multer';
import {
  getAllTourism,
  getTourismById,
  createTourism,
  updateTourism,
  deleteTourism
} from '../../../interfaces/controllers/tourismController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';

const router = express.Router();

// Configure multer untuk handling multiple files
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  },
  fileFilter: (_req, file, cb) => {
    // Check file type
    if (file.mimetype === "image/jpeg" || 
        file.mimetype === "image/png" || 
        file.mimetype === "image/webp") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .jpeg, .png and .webp format allowed!'));
    }
  }
});

// Configure multer fields
const uploadFields = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'gallery', maxCount: 10 }
]);

// Public routes
router.get('/', getAllTourism);
router.get('/:id', getTourismById);

// Protected routes (admin only)
router.post('/', authMiddleware, adminMiddleware, uploadFields, createTourism);
router.put('/:id', authMiddleware, adminMiddleware, uploadFields, updateTourism);
router.delete('/:id', authMiddleware, adminMiddleware, deleteTourism);

export { router as tourismRouter };