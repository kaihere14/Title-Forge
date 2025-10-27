import { Router } from "express";

import verifyJWT from "../middlewares/veirfyJWT.js";
import verifyCredit from "../middlewares/verifyCredit.js";
import { fetchAllPaymennts, initiatePayment, verifyPayment } from "../controllers/paymentController.js";


const router = Router();

router.post("/create-payment",verifyJWT,  initiatePayment);
router.post("/verify-payment",verifyJWT, verifyPayment);
router.get("/fetch-payments", verifyJWT, fetchAllPaymennts);

export default router;