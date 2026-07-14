import { Router } from "express";
import { register, login, logout, me } from "./driver.controller.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { protectRoute } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protectRoute, authorize("Driver"), logout);
router.get("/me", protectRoute, authorize("Driver"), me);

export default router;
