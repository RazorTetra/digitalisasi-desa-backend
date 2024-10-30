// src/interfaces/controllers/financeController.ts

import { Request, Response, NextFunction } from 'express';
import { FinanceUseCase } from '../../application/use-cases/finance/FinanceUseCase';
import { FinanceRepository } from '../../infrastructure/repositories/FinanceRepository';
import { NotFoundError } from '../../common/error/NotFoundError';
import { z } from 'zod';

const financeRepository = new FinanceRepository();
const financeUseCase = new FinanceUseCase(financeRepository);

// Validation Schemas
const periodSchema = z.object({
  tahun: z.number().int().min(2000).max(2100)
});

const financeItemSchema = z.object({
  uraian: z.string().min(1, 'Uraian wajib diisi'),
  dana: z.number().or(
    z.string().transform((val) => Number(val))
  )
});

const financingItemSchema = financeItemSchema.extend({
  jenis: z.enum(['PENERIMAAN', 'PENGELUARAN'])
});

// Period Controllers
export const createPeriod = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = periodSchema.parse(req.body);
    const period = await financeUseCase.createPeriod(validatedData);
    res.status(201).json(period);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    next(error);
  }
};

export const getAllPeriods = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const periods = await financeUseCase.getAllPeriods();
    res.json(periods);
  } catch (error) {
    next(error);
  }
};

export const getPeriodById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const period = await financeUseCase.getPeriodById(id);
    const summary = await financeUseCase.calculatePeriodSummary(id);
    res.json({ ...period, summary });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
};

export const getActivePeriod = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const period = await financeUseCase.getActivePeriod();
    const summary = await financeUseCase.calculatePeriodSummary(period.id);
    res.json({ ...period, summary });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
};


export const updatePeriod = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = periodSchema.parse(req.body);
    const period = await financeUseCase.updatePeriod(id, validatedData.tahun);
    res.json(period);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({ error: error.message });
      return;
    }
    next(error);
  }
};

export const deletePeriod = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await financeUseCase.deletePeriod(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
};

// Income Controllers
export const addIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { periodId } = req.params;
    const validatedData = financeItemSchema.parse(req.body);
    const income = await financeUseCase.addIncome(periodId, validatedData);
    res.status(201).json(income);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    next(error);
  }
};

export const updateIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = financeItemSchema.parse(req.body);
    const income = await financeUseCase.updateIncome(id, validatedData);
    res.json(income);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    next(error);
  }
};

export const deleteIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await financeUseCase.deleteIncome(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Expense Controllers
export const addExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { periodId } = req.params;
    const validatedData = financeItemSchema.parse(req.body);
    const expense = await financeUseCase.addExpense(periodId, validatedData);
    res.status(201).json(expense);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    next(error);
  }
};

export const updateExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = financeItemSchema.parse(req.body);
    const expense = await financeUseCase.updateExpense(id, validatedData);
    res.json(expense);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    next(error);
  }
};

export const deleteExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await financeUseCase.deleteExpense(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Financing Controllers
export const addFinancing = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { periodId } = req.params;
    const validatedData = financingItemSchema.parse(req.body);
    const financing = await financeUseCase.addFinancing(periodId, validatedData);
    res.status(201).json(financing);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    next(error);
  }
};

export const updateFinancing = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = financingItemSchema.parse(req.body);
    const financing = await financeUseCase.updateFinancing(id, validatedData);
    res.json(financing);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    next(error);
  }
};

export const deleteFinancing = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await financeUseCase.deleteFinancing(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Banner & Info Controllers (unchanged)
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
    const { content } = req.body;
    const info = await financeUseCase.updateFinanceInfo(content);
    res.json(info);
  } catch (error) {
    next(error);
  }
};