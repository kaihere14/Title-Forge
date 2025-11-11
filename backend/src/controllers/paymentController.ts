import  { randomUUID } from "crypto";
import User from "../models/user.model.js";
import { redis } from "../db/redis.db.js";
import Payment from "../models/payment.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { Request, Response } from "express";
import { Secret } from "jsonwebtoken";

// Lazy singleton for Razorpay instance. Will throw if required env vars are missing when used.
let _razorpayInstance: Razorpay | null = null;
function getRazorpayInstance() {
  if (!_razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay keys are not configured");
    }
    _razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return _razorpayInstance;
}

export const fetchAllPayments = async (req:Request, res:Response):Promise<unknown> => {
  try {
    const userId = String(req.userId);
    const cachedPayments = await redis.get(`payment_info:${userId}`);
    if (cachedPayments){
      return res
        .status(200)
        .json({ payments: JSON.parse(cachedPayments) });
    }
    const payments = await Payment.find({ userId }).sort({
      createdAt: -1,
    });
    await redis.set(`payment_info:${userId}`, JSON.stringify(payments));
    res.status(200).json({ payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Error fetching payments" });
  }
};

// keep old export name for compatibility
export const fetchAllPaymennts = fetchAllPayments;

export const createRazorpayOrder = async (req: Request, res: Response):Promise<unknown> => {
  try {
    const { amount } = req.body;
    console.log("Creating Razorpay order with amount:", amount);
    const options = {
      amount: amount, // amount in the smallest currency unit
      currency: "INR",
      receipt: `${randomUUID()}`,
    };
    console.log("Creating Razorpay order with options:", options);
  const order = await getRazorpayInstance().orders.create(options);
    console.log("Razorpay order created:", order);
    res.status(200).json({ message: "Razorpay order created", order: order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating Razorpay order", error: error });
  }
};
export interface RazorpayPaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  amount: number;
}
export const verifyRazorpayPayment = async (req:Request, res:Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body as RazorpayPaymentVerification;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");
    const plan = amount >= 49900 ? "pro" : "starter";
    if (generated_signature === razorpay_signature) {
      const paymentInfo =  await Payment.create({
        userId: req.userId,
        merchantOrderId: razorpay_order_id,
        plan: plan,
        amount: amount,
        status: "completed",
      });
      await redis.del(`payment_info:${req.userId}`);
      await redis.expire(`payment_info:${req.userId}`, 3600);// expire cache after 1 hour

      const userId = req.userId;
      console.log("Updating subscription for user:", userId);
      const user = await User.findById(userId);
      if(!user) {
        return  res.status(404).json({ message: "User not found" });
      }
      if(user){
        if (plan === "pro") {
        user.subscription = "pro creator";
        user.credits += 10;
      } else {
        user.subscription = "starter";
        user.credits += 5;
      }
      await user.save({ validateBeforeSave: false });
      }
      await redis.del(`user_info:${req.userId}`);

      return res
        .status(200)
        .json({ redirectUrl: "https://www.titleforge.me/success" });
    } else {
      return res
        .status(400)
        .json({ redirectUrl: "https://www.titleforge.me/failure" });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res
      .status(500)
      .json({
        message: "Error verifying Razorpay payment",
        redirectUrl: "https://www.titleforge.me/failure",
      });
  }
};
