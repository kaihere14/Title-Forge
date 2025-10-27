import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;
const SALT_ROUNDS = 10;

const paymentSchema = new Schema(
  {
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    merchantOrderId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Payment = model("Payment", paymentSchema);

export default Payment;
