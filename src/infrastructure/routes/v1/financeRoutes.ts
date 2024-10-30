// src/infrastructure/routes/v1/financeRoutes.ts

import express from "express";
import multer from "multer";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { adminMiddleware } from "../../middlewares/adminMiddleware";
import {
  // Period endpoints
  createPeriod,
  getAllPeriods,
  getPeriodById,
  getActivePeriod,

  // Income endpoints
  addIncome,
  updateIncome,
  deleteIncome,

  // Expense endpoints
  addExpense,
  updateExpense,
  deleteExpense,

  // Financing endpoints
  addFinancing,
  updateFinancing,
  deleteFinancing,

  // Banner & Info endpoints
  getFinanceBanner,
  updateFinanceBanner,
  getFinanceInfo,
  updateFinanceInfo,
  updatePeriod,
  deletePeriod,
} from "../../../interfaces/controllers/financeController";

const router = express.Router();

// Configure multer for banner upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Public routes
router.get("/banner", getFinanceBanner);
router.get("/info", getFinanceInfo);
router.get("/periods", getAllPeriods);
router.get("/periods/active", getActivePeriod);
router.get("/periods/:id", getPeriodById);

// Protected routes (admin only)
router.post("/periods", authMiddleware, adminMiddleware, createPeriod);

// Income routes
router.post(
  "/periods/:periodId/income",
  authMiddleware,
  adminMiddleware,
  addIncome
);
router.put("/income/:id", authMiddleware, adminMiddleware, updateIncome);
router.delete("/income/:id", authMiddleware, adminMiddleware, deleteIncome);

// Expense routes
router.post(
  "/periods/:periodId/expense",
  authMiddleware,
  adminMiddleware,
  addExpense
);
router.put(
  "/periods/:id",
  authMiddleware,
  adminMiddleware,
  updatePeriod
);

router.delete(
  "/periods/:id",
  authMiddleware,
  adminMiddleware,
  deletePeriod
);

router.put("/expense/:id", authMiddleware, adminMiddleware, updateExpense);
router.delete("/expense/:id", authMiddleware, adminMiddleware, deleteExpense);

// Financing routes
router.post(
  "/periods/:periodId/financing",
  authMiddleware,
  adminMiddleware,
  addFinancing
);
router.put("/financing/:id", authMiddleware, adminMiddleware, updateFinancing);
router.delete(
  "/financing/:id",
  authMiddleware,
  adminMiddleware,
  deleteFinancing
);

// Banner & Info routes
router.put(
  "/banner",
  authMiddleware,
  adminMiddleware,
  upload.single("file"),
  updateFinanceBanner
);
router.put("/info", authMiddleware, adminMiddleware, updateFinanceInfo);

export { router as financeRouter };
