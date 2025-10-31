import { Router } from "express";
import {
  register,
  login,
  logout,
  getUserDetail,
  tokenRefresh,
  deleteUser,
  forgotPassword,
} from "../controllers/useController.js";
import { rateLimit2 } from "../middlewares/rateLimit copy.js";
import verifyJWT from "../middlewares/veirfyJWT.js";
import { generateOTP } from "../controllers/otp.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyJWT, rateLimit2, getUserDetail);
router.post("/refresh-token", rateLimit2, tokenRefresh);
router.delete("/me", verifyJWT, deleteUser);
router.post("/generate-otp", generateOTP);
router.post("/forgot-password", forgotPassword);

export default router;
