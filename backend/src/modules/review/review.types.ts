import { Types } from "mongoose";

export interface Review {
  ride: Types.ObjectId;

  reviewer: Types.ObjectId;
  reviewerType: "User" | "Driver";

  reviewee: Types.ObjectId;
  revieweeType: "User" | "Driver";

  rating: number;
  comment?: string;
}

export interface CreateReviewInput {
  rideId: string;
  rating: number;
  comment?: string;
}

export interface CreateReviewResponse {
  message: string;
}

export interface GetReviewsResponse {
  reviews: Review[];
}

export interface GetReviewSummaryResponse {
  averageRating: number;
  totalRatings: number;
}

// export interface DriverParams {
//   driverId: string;
// }

// export interface UserParams {
//   userId: string;
// }
