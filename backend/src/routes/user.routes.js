import { Router } from "express";
import { register, login, logout, getUserDetail } from "../controllers/useController.js";
import { rateLimit2 } from "../middlewares/rateLimit copy.js";
import  verifyJWT  from "../middlewares/veirfyJWT.js";


const router = Router();
router.use(rateLimit2);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyJWT, getUserDetail);

export default router;