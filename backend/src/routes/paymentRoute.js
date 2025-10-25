import { Router } from "express";

import verifyJWT from "../middlewares/veirfyJWT.js";
import verifyCredit from "../middlewares/verifyCredit.js";
import { initiatePayment, verifyPayment } from "../controllers/paymentController.js";


const router = Router();

router.post("/create-payment",  initiatePayment);
router.post("/verify-payment", verifyPayment);


export default router;