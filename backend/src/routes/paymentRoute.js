import { Router } from "express";

import verifyJWT from "../middlewares/veirfyJWT.js";
import verifyCredit from "../middlewares/verifyCredit.js";
import { fetchAllPaymennts, initiatePayment, verifyPayment } from "../controllers/paymentController.js";
import { rateLimit2 } from "../middlewares/rateLimit copy.js";


const router = Router();

router.post("/create-payment",verifyJWT,rateLimit2,  initiatePayment);
router.post("/verify-payment",verifyJWT, rateLimit2, verifyPayment);
router.get("/fetch-payments", verifyJWT, rateLimit2 , fetchAllPaymennts);

export default router;