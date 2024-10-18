// src/infrastructure/middlewares/adminMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { UserPayload } from "../../types/auth";
// Extend the Express Request type globally
declare global {
  interface RequestWithUser extends Request {
    user?: UserPayload;
  }
}
export const adminMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === Role.ADMIN) {
    next();
  } else {
    res
      .status(403)
      .json({ error: "Access denied. Admin privileges required." });
  }
};
