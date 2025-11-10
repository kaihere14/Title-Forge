import User, { IUser } from "../models/user.model";
import { Request, Response } from "express";
import jwt, { Jwt, JwtPayload, Secret } from "jsonwebtoken";
import Payment from "../models/payment.model";
import { redis } from "../db/redis.db";
import FavLog from "../models/favLog";
// mongoose import removed because _id is handled as string coercion where needed


const JWT_SECRET = process.env.JWT_SECRET as Secret;

function signToken(userId: string) {
  const refreshToken = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
  const accessToken = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "15m",
  });
  return { accessToken, refreshToken };
}

export interface Register {
  username: string;
  email: string;
  password: string;
  otp: string;
}

export const register = async(req:Request, res:Response):Promise<unknown> => {
  try {
    const { username  , email, password,otp } = req.body as Register;
    if (!username || !email || !password || !otp) {
      return res
        .status(400)
        .json({ message: "username, email, password and otp are required" });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already in use" });
    const verifyOtp = await redis.get(`register_otp_${email}`);
    if (!verifyOtp || verifyOtp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    await redis.del(`register_otp_${email}`);
  const user = await User.create({ username, email, password });
  const { accessToken, refreshToken } = signToken(String((user as any)._id));

    res.status(201).json({
      user,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export interface Login {
  email: string;
  password: string;
}

export const login = async (req:Request, res:Response): Promise<unknown> => {
  try {
    const { email, password } = req.body as Login;
    if (!email || !password)
      return res.status(400).json({ message: "email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });


    const valid = await user.verifyPassword(password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const userIdStr = String((user as any)._id);
  await redis.set(`user_info:${userIdStr}`, JSON.stringify(user)); 
  await redis.expire(`user_info:${userIdStr}`, 3600);

  const { accessToken, refreshToken } = signToken(userIdStr);

    res.status(200).json({
      user,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });

  }
};

export const logout = async (req:Request, res:Response):Promise<Response> => {
  return res.json({ message: "Logged out successfully" });
};


export const getUserDetail = async (req:Request, res:Response): Promise<unknown> => {
  const id = String(req.userId);
  try {
  let user;
    if(await redis.exists(`user_info:${id}`)) {
      const cachedUser = await redis.get(`user_info:${id}`);
      return  res.json({ user: JSON.parse(cachedUser as string) });
    }else{
      user = await User.findById(id);
      await redis.set(`user_info:${id}`, JSON.stringify(user));
      await redis.expire(`user_info:${id}`, 3600);
    }
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export interface TokenPayload extends JwtPayload {
  id: string;
}

export const tokenRefresh = async(req:Request,res:Response):Promise<unknown> => {
  const {refreshToken} = req.body;
  try {
    if(!refreshToken) {
      return res.status(400).json({message:"Refresh token required"});
    }

  const decoded = jwt.verify(refreshToken, JWT_SECRET) as TokenPayload;
  const userId = String(decoded.id);
    
    const user = await User.findById(userId);
    if(!user) {
      return res.status(404).json({message:"User not found"});
    }

  const {accessToken, refreshToken: newRefreshToken} = signToken(userId);
    
    res.json({accessToken, refreshToken: newRefreshToken});
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({message: "Error refreshing token"});
  }
}



export const deleteUser = async(req:Request,res:Response):Promise<unknown> => {
  const id = String(req.userId);
  try {
    const user = await User.findByIdAndDelete(id);
  await Payment.deleteMany({ userId: id });
    if(!user) {
      return res.status(404).json({message:"User not found"});
    }

    res.json({message:"User deleted successfully"});
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({message: "Error deleting user"});
  }
}

export interface ForgotPassword {
  email: string;
  newPassword: string;
  otp: string;
  otpExpiry?: Date;
}

export const forgotPassword = async(req:Request,res:Response):Promise<unknown> => {

  const { email, newPassword, otp } = req.body as ForgotPassword;
  try {
    if (!email || !newPassword || !otp) {
      return res.status(400).json({ message: "Email, new password and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } 
  
    if (user.otp !== otp || !user.otpExpiry || new Date(user.otpExpiry).getTime() < Date.now() ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


export const saveFavLog = async (req:Request, res:Response):Promise<unknown> => {
  const userId = String(req.userId);
  const { title } = req.body;

  try {
    const existingLog = await FavLog.findOne({ userId, title });
    if (existingLog) {
      return res.status(409).json({ message: "Favorite log already exists" });
    }
    const favLog = new FavLog({ userId, title });
    await favLog.save();
    res.status(201).json({ message: "Favorite log saved", favLog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFavLog = async (req:Request, res:Response):Promise<unknown> => {
  const userId = String(req.userId);
  const { title } = req.body;
  try {
    const result = await FavLog.findOneAndDelete({ userId, title });
    if (!result) {
      return res.status(404).json({ message: "Favorite log not found" });
    }
    res.status(200).json({ message: "Favorite log removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } 
};

export const allFavLogs = async (req:Request, res:Response):Promise<unknown> => {
  const userId = String(req.userId);
  try {
    const favLogs = await FavLog.find({ userId });
    return res.status(200).json({ favLogs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export default {
  register,
  login,
  logout,
  getUserDetail,
  allFavLogs,
  tokenRefresh,
  deleteUser,
  forgotPassword,
  saveFavLog,
  removeFavLog,
};
