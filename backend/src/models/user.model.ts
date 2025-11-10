import mongoose,{Document} from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;
const SALT_ROUNDS = 10;

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  subscription: "free" | "starter" | "pro creator";
  usedCredits: number;
  credits: number;
  otp?: number|string;
  otpExpiry?: Date|number;
  verifyPassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, trim: true, index: true },
    email: {
      type:String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index : true,
    },
    password: { type: String, required: true },
    subscription: {
      type: String,
      enum: ["free", "starter", "pro creator"],
      default: "free",
    },
    usedCredits: {
      type: Number,
      default: 0,
    },
    credits: {
      type: Number,
      default: 1,
    },
    otp: { type: Number },
    otpExpiry: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    return next();
  } catch (err) {
      return next(err as Error);
    }
});

userSchema.methods.verifyPassword = async function (candidatePassword:string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = model<IUser>("User", userSchema);

export default User;
