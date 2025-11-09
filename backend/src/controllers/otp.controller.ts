import { redis } from "../db/redis.db";
import User from "../models/user.model";
import { forgotPasswordEmail } from "./resend.controller";
import { registrationEmail } from "./resend.controller";

export const generateOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; 
    await user.save();


    await forgotPasswordEmail(otp, email);

    res.status(200).json({ message: "OTP generated and sent"}); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const registerOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(404).json({ message: "User already registered" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const genOtp = await redis.setex(`register_otp_${email}`, 600, otp); 
    if (!genOtp) {
      return res.status(500).json({ message: "Error generating OTP" });
    }
    const mail = await registrationEmail(otp, email);
    if(!mail){
      return res.status(500).json({ message: "Error sending OTP email" });
    }
    res.status(200).json({ message: "OTP generated and sent" });
  } catch (error) {
    console.error("Error in registerOTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};