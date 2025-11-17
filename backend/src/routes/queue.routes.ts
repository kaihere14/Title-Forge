import { Router } from "express";
const router = Router();
import { addEmailToQueue } from "../controllers/bullmq.controller.js";
import verifyJWT from "../middlewares/veirfyJWT.js";

router.post("/add-emails", addEmailToQueue);

export default router;