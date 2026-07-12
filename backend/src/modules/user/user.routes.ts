import { Router } from "express";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import { getProfile, updateProfile } from "./user.controller.js";

const router = Router();

router.get("/profile", protectRoute, getProfile);
router.patch("/profile", protectRoute, updateProfile);

export default router;
