import { Router } from "express";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import {
  createReviewController,
  getDriverReviewsController,
  getDriverReviewSummaryController,
  getUserReviewsController,
  getUserReviewSummaryController,
} from "./review.controller.js";

const router = Router();

router.post("/", protectRoute, createReviewController);

// Public
router.get("/driver/:driverId", getDriverReviewsController);
router.get("/driver/:driverId/summary", getDriverReviewSummaryController);

// Protected
router.get("/user/:userId", protectRoute, getUserReviewsController);
router.get(
  "/user/:userId/summary",
  protectRoute,
  getUserReviewSummaryController,
);

export default router;
