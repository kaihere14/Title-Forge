import { Router } from "express";

import verifyJWT from "../middlewares/veirfyJWT.js";
import {
  createRazorpayOrder,
  fetchAllPaymennts,
  verifyRazorpayPayment,
} from "../controllers/paymentController.js";
import { rateLimit2 } from "../middlewares/rateLimit copy.js";

const router = Router();

router.get("/fetch-payments", verifyJWT, rateLimit2, fetchAllPaymennts);
router.post("/razorcreate-order", verifyJWT, rateLimit2, createRazorpayOrder);
router.post(
  "/verifyrazorpay-payment",
  verifyJWT,
  rateLimit2,
  verifyRazorpayPayment
);

export default router;
