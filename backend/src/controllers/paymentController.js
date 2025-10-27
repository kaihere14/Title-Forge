import { MetaInfo, PaymentDetail, StandardCheckoutPayRequest } from "pg-sdk-node";
import { randomUUID } from "crypto";
import { client } from "../utils/paymentClass.js";
import User from "../models/user.model.js";
import { redis } from "../db/redis.db.js";
import Payment from "../models/payment.model.js";


export const initiatePayment = async (req, res) => {
  try {
    const { amount } = req.body;
    const merchantOrderId = randomUUID();
    const redirectUrl = `https://title-forge.vercel.app/payment-verify/${merchantOrderId}`;

    const metaInfo = MetaInfo.builder().udf1("udf1").udf2("udf2").build();

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amount)
      .redirectUrl(redirectUrl)
      .metaInfo(metaInfo)
      .build();

      await Payment.create({
        userId: req.userId,
        merchantOrderId: merchantOrderId,
        plan: amount >= 199900 ? "pro" : "starter",
        amount: amount,
        status: "pending",
      });

    const response = await client.pay(request);
    const checkoutPageUrl = response.redirectUrl;

    res.status(200).json({ checkoutPageUrl });
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({
      message: "Error initiating payment",
      error: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { merchantOrderId } = req.body;
    const response = await client.getOrderStatus(merchantOrderId);
    const state = response.state;
    console.log("Payment verification state:", state);

    if (state === "COMPLETED") {
      await redis.del(`user_info:${req.userId}`);
      await Payment.updateOne(
        { merchantOrderId: merchantOrderId },
        { status: "completed" }
      );

          if (response.amount >= 199900) {
            const userId = req.userId;
            const user = await User.findById(userId); 
            user.credits += 50;
            user.subscription = "pro"
            await user.save({validateBeforeSave:false})
          } else {
          await redis.del(`user_info:${req.userId}`);
          
            const userId = req.userId;
            const user = await User.findById(userId)
            user.credits += 10;
            user.subscription = "starter"
            await user.save({validateBeforeSave:false})
          }
      res.json({ redirectUrl: "https://title-forge.vercel.app/success" });
    } else {
      await Payment.updateOne(
        { merchantOrderId: merchantOrderId },
        { status: "failed" }
      );
      await redis.del(`user_info:${req.userId}`);
      res.json({ redirectUrl: "https://title-forge.vercel.app/failure" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Error verifying payment" });
  }
};


export const fetchAllPaymennts = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Error fetching payments" });
  }
}