import { MetaInfo, StandardCheckoutPayRequest } from "pg-sdk-node";
import { randomUUID } from "crypto";
import { client } from "../utils/paymentClass.js";
import User from "../models/user.model.js";


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

    const response = await client.pay(request);
    const checkoutPageUrl = response.redirectUrl;

    // ✅ Better: send JSON so frontend can handle redirect
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
      if (response.amount >= 199900) {
        const userId = req.userId;
        await User.findByIdAndUpdate(userId, {credits: credits + 50});
      }else {
        const userId = req.userId;
        await User.findByIdAndUpdate(userId, { credits: credits + 10 });
      }
      res.json({ redirectUrl: "https://title-forge.vercel.app/success" });
    } else {
      res.json({ redirectUrl: "https://title-forge.vercel.app/failure" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Error verifying payment" });
  }
};
