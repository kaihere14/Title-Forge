import { Router } from "express";
import { register, login, logout, getUserDetail ,tokenRefresh } from "../controllers/useController.js";
import { rateLimit2 } from "../middlewares/rateLimit copy.js";
import  verifyJWT  from "../middlewares/veirfyJWT.js";


const router = Router();


router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyJWT, rateLimit2,getUserDetail);
router.post("/refresh-token",rateLimit2, tokenRefresh);

export default router;