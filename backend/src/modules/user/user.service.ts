import { HydratedDocument } from "mongoose";
import { User } from "./user.model.js";
import AppError from "../../utils/AppError.js";
import {
  GetUserProfileResponse,
  UpdateUserProfileInput,
  UpdateUserProfileResponse,
} from "./user.types.js";

export const getUserProfile = async (
  user: HydratedDocument<User>,
): Promise<GetUserProfileResponse> => {
  return {
    success: true,
    data: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isEmailVerified: user.isEmailVerified,
    },
  };
};

export const updateUserProfile = async (
  user: HydratedDocument<User>,
  { name }: UpdateUserProfileInput,
): Promise<UpdateUserProfileResponse> => {
  // Validate name
  if (!name || !name.trim()) {
    throw new AppError("Name is required", 400);
  }

  if (name.trim().length > 100) {
    throw new AppError("Name cannot exceed 100 characters", 400);
  }

  // Update
  user.name = name.trim();

  await user.save();

  return {
    success: true,
    message: "Profile updated successfully",
    data: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isEmailVerified: user.isEmailVerified,
    },
  };
};
