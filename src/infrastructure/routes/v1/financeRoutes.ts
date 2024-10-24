// src/infrastructure/routes/v1/financeRoutes.ts

import express from 'express';
import multer from 'multer';
import { 
  getFinanceBanner,
  updateFinanceBanner,
  getFinanceInfo,
  updateFinanceInfo,
  getIncomeItems,
  createIncomeItem,
  updateIncomeItem,
  deleteIncomeItem,
  getExpenseItems,
  createExpenseItem,
  updateExpenseItem,
  deleteExpenseItem,
  getFinancingItems,
  createFinancingItem,
  updateFinancingItem,
  deleteFinancingItem,
  getFinanceSummary,
} from '../../../interfaces/controllers/financeController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';

const router = express.Router();

// Configure multer for banner upload
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Public routes
router.get('/banner', getFinanceBanner);
router.get('/info', getFinanceInfo);
router.get('/income', getIncomeItems);
router.get('/expense', getExpenseItems);
router.get('/financing', getFinancingItems);
router.get('/summary', getFinanceSummary);

// Protected routes (admin only)
router.put('/banner', authMiddleware, adminMiddleware, upload.single('file'), updateFinanceBanner);
router.put('/info', authMiddleware, adminMiddleware, updateFinanceInfo);

// Income routes
router.post('/income', authMiddleware, adminMiddleware, createIncomeItem);
router.put('/income/:id', authMiddleware, adminMiddleware, updateIncomeItem);
router.delete('/income/:id', authMiddleware, adminMiddleware, deleteIncomeItem);

// Expense routes
router.post('/expense', authMiddleware, adminMiddleware, createExpenseItem);
router.put('/expense/:id', authMiddleware, adminMiddleware, updateExpenseItem);
router.delete('/expense/:id', authMiddleware, adminMiddleware, deleteExpenseItem);

// Financing routes
router.post('/financing', authMiddleware, adminMiddleware, createFinancingItem);
router.put('/financing/:id', authMiddleware, adminMiddleware, updateFinancingItem);
router.delete('/financing/:id', authMiddleware, adminMiddleware, deleteFinancingItem);

export { router as financeRouter };