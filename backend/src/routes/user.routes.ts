import { Router } from "express";
import {
  register,
  login,
  logout,
  getUserDetail,
  tokenRefresh,
  deleteUser,
  forgotPassword,
  saveFavLog,
  removeFavLog,
  allFavLogs,
} from "../controllers/useController";
import { rateLimit2 } from "../middlewares/rateLimit copy";
import verifyJWT from "../middlewares/veirfyJWT";
import { generateOTP, registerOTP } from "../controllers/otp.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyJWT, rateLimit2, getUserDetail);
router.post("/refresh-token", rateLimit2, tokenRefresh);
router.delete("/me", verifyJWT, deleteUser);
router.post("/generate-otp", generateOTP);
router.post("/forgot-password", forgotPassword);
router.post("/save-fav-log", verifyJWT, saveFavLog);
router.post("/remove-fav-log", verifyJWT, removeFavLog);
router.get("/all-fav-logs", verifyJWT, allFavLogs);
router.post("/register-otp", registerOTP);

export default router;
