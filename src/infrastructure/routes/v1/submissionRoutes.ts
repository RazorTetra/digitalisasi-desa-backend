// src/infrastructure/routes/v1/submissionRoutes.ts

import express from 'express';
import multer from 'multer';
import {
  submitDocument,
  getSubmission,
  getAllSubmissions,
  deleteSubmission,
  getStats,
  getSubmissionsByWhatsapp,
  updateSubmissionStatus,
  submissionLimiter
} from '../../../interfaces/controllers/submissionController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Public routes
router.post(
  '/',
  submissionLimiter,
  upload.single('file'),
  submitDocument
);

router.get('/whatsapp/:whatsapp', getSubmissionsByWhatsapp);

// Admin routes
router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  getAllSubmissions
);

router.get(
  '/stats',
  authMiddleware,
  adminMiddleware,
  getStats
);

router.get(
  '/:id',
  authMiddleware,
  adminMiddleware,
  getSubmission
);

// New route for updating status
router.patch(
  '/:id/status',
  authMiddleware,
  adminMiddleware,
  updateSubmissionStatus
);

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  deleteSubmission
);

export { router as submissionRouter };