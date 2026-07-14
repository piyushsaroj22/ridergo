import bcrypt from "bcrypt";
import { Response } from "express";
import { HydratedDocument } from "mongoose";
import { Driver } from "./driver.model.js";
import DriverModel from "./driver.model.js";
import AppError from "../../utils/AppError.js";
import { generateToken } from "../../utils/jwt.js";
import { setAuthCookie } from "../../utils/cookie.js";
import {
  GetCurrentDriverResponse,
  LoginDriverInput,
  LoginDriverResponse,
} from "./driver.types.js";
import { RegisterDriverInput, RegisterDriverResponse } from "./driver.types.js";
import { sendVerificationEmail } from "../emailVerification/emailVerification.service.js";

export const registerDriver = async ({
  name,
  email,
  password,
  phone,
  vehicleType,
}: RegisterDriverInput): Promise<RegisterDriverResponse> => {
  // Validate required fields
  if (!name || !email || !password || !phone || !vehicleType) {
    throw new AppError("All fields are required", 400);
  }

  // Check duplicate email
  const existingDriver = await DriverModel.findOne({ email });

  if (existingDriver) {
    throw new AppError("Email already exists", 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create driver
  const driver = await DriverModel.create({
    name,
    email,
    password: hashedPassword,
    phone,
    vehicleType,
  });

  // Send verification email
  await sendVerificationEmail(
    driver._id.toString(),
    "Driver",
    driver.name,
    driver.email,
  );

  return {
    success: true,
    message: "Registration successful. Please verify your email.",
    data: {
      id: driver._id.toString(),
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      vehicleType: driver.vehicleType,
    },
  };
};

export const loginDriver = async (
  { email, password }: LoginDriverInput,
  res: Response,
): Promise<LoginDriverResponse> => {
  // Validate required fields
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  // Find driver
  const driver = await DriverModel.findOne({ email });

  if (!driver) {
    throw new AppError("Invalid email or password", 401);
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, driver.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  // Email verification check
  if (!driver.isEmailVerified) {
    throw new AppError("Please verify your email first", 403);
  }

  // Approval check
  if (!driver.isApproved) {
    throw new AppError("Your account is under review", 403);
  }

  // Generate JWT
  const jwtToken = generateToken(driver._id.toString(), "Driver");

  // Set cookie
  setAuthCookie(res, jwtToken);

  return {
    success: true,
    message: "Login successful",
    data: {
      id: driver._id.toString(),
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      vehicleType: driver.vehicleType,
      profileImage: driver.profileImage,
      isEmailVerified: driver.isEmailVerified,
      isApproved: driver.isApproved,
      isOnline: driver.isOnline,
    },
  };
};

export const logoutDriver = () => {
  return {
    success: true,
    message: "Logout successful",
  };
};

export const getCurrentDriver = async (
  driver: HydratedDocument<Driver>,
): Promise<GetCurrentDriverResponse> => {
  return {
    success: true,
    data: {
      id: driver._id.toString(),
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      vehicleType: driver.vehicleType,
      profileImage: driver.profileImage,
      isEmailVerified: driver.isEmailVerified,
      isApproved: driver.isApproved,
      isOnline: driver.isOnline,
    },
  };
};
