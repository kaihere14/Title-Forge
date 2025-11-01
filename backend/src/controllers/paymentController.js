import { randomUUID } from "crypto";
import User from "../models/user.model.js";
import { redis } from "../db/redis.db.js";
import Payment from "../models/payment.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const fetchAllPaymennts = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Error fetching payments" });
  }
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    console.log("Creating Razorpay order with amount:", amount);
    const options = {
      amount: amount, // amount in the smallest currency unit
      currency: "INR",
      receipt: `${randomUUID()}`,
    };
    console.log("Creating Razorpay order with options:", options);
    const order = await razorpayInstance.orders.create(options);
    console.log("Razorpay order created:", order);
    res.status(200).json({ message: "Razorpay order created", order: order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating Razorpay order", error: error });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");
    const plan = amount >= 49900 ? "pro" : "starter";
    if (generated_signature === razorpay_signature) {
      await Payment.create({
        userId: req.userId,
        merchantOrderId: razorpay_order_id,
        plan: plan,
        amount: amount,
        status: "completed",
      });

      const userId = req.userId;
      console.log("Updating subscription for user:", userId);
      const user = await User.findById(userId);
      if (plan === "pro") {
        user.subscription = "pro";
        user.credits += 10;
      } else {
        user.subscription = "starter";
        user.credits += 5;
      }
      await user.save({ validateBeforeSave: false });
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
