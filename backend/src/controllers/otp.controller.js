import User from "../models/user.model.js";
import { forgotPasswordEmail } from "./resend.controller.js";

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

    res.status(200).json({ message: "OTP generated and sent", otp }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};