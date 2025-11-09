import mongoose , {Document} from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;
const SALT_ROUNDS = 10;

export interface IPayment extends Document {
  plan: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  merchantOrderId: string;
  userId: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    merchantOrderId: { type: String, required: true, unique: true , index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

const Payment = model<IPayment>("Payment", paymentSchema);

export default Payment;
