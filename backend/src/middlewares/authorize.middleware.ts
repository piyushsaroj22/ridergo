import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";
import { AccountType } from "../utils/jwt.js";

export const authorize =
  (...allowedRoles: AccountType[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.account) {
      return next(new AppError("Unauthorized", 401));
    }

    if (!req.accountType) {
      return next(new AppError("Unauthorized", 401));
    }

    if (!allowedRoles.includes(req.accountType)) {
      return next(new AppError("Forbidden", 403));
    }

    next();
  };
