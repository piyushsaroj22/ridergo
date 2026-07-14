import asyncHandler from "../../utils/asyncHandler.js";
import { HydratedDocument } from "mongoose";
import { Driver } from "./driver.model.js";
import {
  registerDriver,
  loginDriver,
  logoutDriver,
  getCurrentDriver,
} from "./driver.service.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerDriver(req.body);

  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginDriver(req.body, res);

  res.status(200).json(result);
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");

  const result = logoutDriver();

  res.status(200).json(result);
});

export const me = asyncHandler(async (req, res) => {
  const result = await getCurrentDriver(
    req.account as HydratedDocument<Driver>,
  );

  res.status(200).json(result);
});
