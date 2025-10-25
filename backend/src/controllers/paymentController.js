import {
  StandardCheckoutClient,
  Env,
  MetaInfo,
  StandardCheckoutPayRequest,
} from "pg-sdk-node";
import { randomUUID } from "crypto";
import { client } from "../utils/paymentClass.js";

export const initiatePayment = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.userId; // From JWT middleware
    const merchantOrderId = randomUUID();
    const redirectUrl = `${process.env.FRONTEND_DOMAIN}/payment-verify/${merchantOrderId}`;
    const metaInfo = MetaInfo.builder().udf1("udf1").udf2("udf2").build();

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amount)
      .customerId(userId) // Required field - using userId from JWT
      .redirectUrl(redirectUrl)
      .metaInfo(metaInfo)
      .build();

    // Using pay method to initiate payment
    const response = await client.pay(request);
    const checkoutPageUrl = response.redirectUrl;
    res.redirect(checkoutPageUrl);
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({
      message: "Error initiating payment",
      error: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  console.log("Verifying payment...", req.body);
  const { merchantOrderId } = req.body;
  try {
    client.getOrderStatus(merchantOrderId).then((response) => {
      const state = response.state;
      if (state === "SUCCESS") {
        res.redirect(`${process.env.FRONTEND_DOMAIN}/success`);
      } else {
        res.redirect(`${process.env.FRONTEND_DOMAIN}/failure`);
      }
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Error verifying payment" });
  }
};
