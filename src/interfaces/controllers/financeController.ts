// src/interfaces/controllers/financeController.ts

import { Request, Response, NextFunction } from 'express';
import { FinanceUseCase } from '../../application/use-cases/finance/FinanceUseCase';
import { FinanceRepository } from '../../infrastructure/repositories/FinanceRepository';
import { NotFoundError } from '../../common/error/NotFoundError';
import { z } from 'zod';

const financeRepository = new FinanceRepository();
const financeUseCase = new FinanceUseCase(financeRepository);

// Validation Schemas
const financeInfoSchema = z.object({
  content: z.string().min(1),
});

const financeItemSchema = z.object({
  uraian: z.string().min(1),
  anggaran: z.number().or(z.string()).transform(val => typeof val === 'string' ? parseFloat(val) : val),
  realisasi: z.number().or(z.string()).transform(val => typeof val === 'string' ? parseFloat(val) : val),
});

// Banner Controllers
export const getFinanceBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const banner = await financeUseCase.getFinanceBanner();
    res.json(banner);
  } catch (error) {
    next(error);
  }
};

export const updateFinanceBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const banner = await financeUseCase.updateFinanceBanner(req.file);
    res.json(banner);
  } catch (error) {
    next(error);
  }
};

// Info Controllers
export const getFinanceInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const info = await financeUseCase.getFinanceInfo();
    res.json(info);
  } catch (error) {
    next(error);
  }
};

export const updateFinanceInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = financeInfoSchema.parse(req.body);
    const info = await financeUseCase.updateFinanceInfo(validatedData.content);
    res.json(info);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else {
      next(error);
    }
  }
};

// Income Controllers
export const getIncomeItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const items = await financeUseCase.getIncomeItems();
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const createIncomeItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = financeItemSchema.parse(req.body);
    const item = await financeUseCase.createIncomeItem(validatedData);
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else {
      next(error);
    }
  }
};

export const updateIncomeItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = financeItemSchema.parse(req.body);
    const item = await financeUseCase.updateIncomeItem(id, validatedData);
    res.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const deleteIncomeItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await financeUseCase.deleteIncomeItem(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

// Expense Controllers
export const getExpenseItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const items = await financeUseCase.getExpenseItems();
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const createExpenseItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = financeItemSchema.parse(req.body);
    const item = await financeUseCase.createExpenseItem(validatedData);
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else {
      next(error);
    }
  }
};

export const updateExpenseItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = financeItemSchema.parse(req.body);
    const item = await financeUseCase.updateExpenseItem(id, validatedData);
    res.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const deleteExpenseItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await financeUseCase.deleteExpenseItem(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

// Financing Controllers
export const getFinancingItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const items = await financeUseCase.getFinancingItems();
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const createFinancingItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = financeItemSchema.parse(req.body);
    const item = await financeUseCase.createFinancingItem(validatedData);
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else {
      next(error);
    }
  }
};

export const updateFinancingItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = financeItemSchema.parse(req.body);
    const item = await financeUseCase.updateFinancingItem(id, validatedData);
    res.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const deleteFinancingItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await financeUseCase.deleteFinancingItem(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

// Summary Controller
export const getFinanceSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const summary = await financeUseCase.getFinanceSummary();
    res.json(summary);
  } catch (error) {
    next(error);
  }
};
