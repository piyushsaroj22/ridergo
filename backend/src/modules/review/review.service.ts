import { HydratedDocument } from "mongoose";
import AppError from "../../utils/AppError.js";
import RideModel from "../ride/ride.model.js";
import ReviewModel from "./review.model.js";
import UserModel, { User } from "../user/user.model.js";
import DriverModel, { Driver } from "../driver/driver.model.js";
import {
  CreateReviewInput,
  CreateReviewResponse,
  GetReviewsResponse,
  GetReviewSummaryResponse,
} from "./review.types.js";

export const createReview = async (
  reviewer: HydratedDocument<User> | HydratedDocument<Driver>,
  accountType: "User" | "Driver",
  { rideId, rating, comment }: CreateReviewInput,
): Promise<CreateReviewResponse> => {
  // Validate rating
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new AppError("Rating must be between 1 and 5.", 400);
  }

  const ride = await RideModel.findById(rideId);

  if (!ride) {
    throw new AppError("Ride not found.", 404);
  }

  if (ride.status !== "COMPLETED") {
    throw new AppError("You can only review completed rides.", 400);
  }

  if (
    accountType === "User" &&
    ride.rider.toString() !== reviewer._id.toString()
  ) {
    throw new AppError("You are not allowed to review this ride.", 403);
  }

  if (
    accountType === "Driver" &&
    ride.driver?.toString() !== reviewer._id.toString()
  ) {
    throw new AppError("You are not allowed to review this ride.", 403);
  }

  const existingReview = await ReviewModel.findOne({
    ride: ride._id,
    reviewer: reviewer._id,
  });

  if (existingReview) {
    throw new AppError("You have already reviewed this ride.", 409);
  }

  const reviewee = accountType === "User" ? ride.driver : ride.rider;

  const revieweeType = accountType === "User" ? "Driver" : "User";

  if (!reviewee) {
    throw new AppError("Review recipient not found.", 404);
  }

  await ReviewModel.create({
    ride: ride._id,
    reviewer: reviewer._id,
    reviewerType: accountType,
    reviewee,
    revieweeType,
    rating,
    comment,
  });

  const [stats] = await ReviewModel.aggregate([
    {
      $match: {
        reviewee,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: {
          $avg: "$rating",
        },
        totalRatings: {
          $sum: 1,
        },
      },
    },
  ]);

  const averageRating = Number((stats?.averageRating ?? 0).toFixed(1));

  const totalRatings = stats?.totalRatings ?? 0;

  if (revieweeType === "Driver") {
    await DriverModel.findByIdAndUpdate(reviewee, {
      averageRating,
      totalRatings,
    });
  } else {
    await UserModel.findByIdAndUpdate(reviewee, {
      averageRating,
      totalRatings,
    });
  }

  return {
    message: "Review submitted successfully",
  };
};

export const getDriverReviews = async (
  driverId: string,
): Promise<GetReviewsResponse> => {
  const reviews = await ReviewModel.find({
    reviewee: driverId,
    revieweeType: "Driver",
  })
    .populate("reviewer", "fullName profileImage")
    .sort({ createdAt: -1 });

  return { reviews };
};

export const getUserReviews = async (
  userId: string,
): Promise<GetReviewsResponse> => {
  const reviews = await ReviewModel.find({
    reviewee: userId,
    revieweeType: "User",
  })
    .populate("reviewer", "fullName profileImage")
    .sort({ createdAt: -1 });

  return { reviews };
};

export const getDriverReviewSummary = async (
  driverId: string,
): Promise<GetReviewSummaryResponse> => {
  const driver = await DriverModel.findById(driverId).select(
    "averageRating totalRatings",
  );

  if (!driver) {
    throw new AppError("Driver not found.", 404);
  }

  return {
    averageRating: driver.averageRating,
    totalRatings: driver.totalRatings,
  };
};

export const getUserReviewSummary = async (
  userId: string,
): Promise<GetReviewSummaryResponse> => {
  const user = await UserModel.findById(userId).select(
    "averageRating totalRatings",
  );

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return {
    averageRating: user.averageRating,
    totalRatings: user.totalRatings,
  };
};
