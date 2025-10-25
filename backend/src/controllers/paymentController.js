import { MetaInfo, StandardCheckoutPayRequest } from "pg-sdk-node";
import { randomUUID } from "crypto";
import { client } from "../utils/paymentClass.js";

export const initiatePayment = async (req, res) => {
  try {
    const { amount } = req.body;
    console.log("Amount received for payment initiation:", amount);
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

    if (state === "SUCCESS") {
      res.json({ redirectUrl: "https://title-forge.vercel.app/success" });
    } else {
      res.json({ redirectUrl: "https://title-forge.vercel.app/failure" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Error verifying payment" });
  }
};
