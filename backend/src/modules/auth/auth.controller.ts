import { Request, Response } from "express";

export const register = async (_req: Request, res: Response): Promise<void> => {
  res.status(201).json({
    success: true,
    message: "User registration endpoint",
  });
};
