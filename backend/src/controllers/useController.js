import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../db/redis.db.js";

const JWT_SECRET = process.env.JWT_SECRET;

function signToken(userId) {
  const refreshToken = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
  const accessToken = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "15m",
  });
  return { accessToken, refreshToken };
}

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "username, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already in use" });

    const user = await User.create({ username, email, password });
    const { accessToken, refreshToken } = signToken(user._id);

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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });



    const valid = await user.verifyPassword(password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    await redis.set(`user_info:${user._id}`, JSON.stringify(user)); 
    await redis.expire(`user_info:${user._id}`, 3600);

    const { accessToken, refreshToken } = signToken(user._id);

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

export const logout = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};

export const getUserDetail = async (req, res) => {
  const id = req.userId;
  try {
  let user;
    if(await redis.exists(`user_info:${id}`)) {
      const cachedUser = await redis.get(`user_info:${id}`);
      return  res.json({ user: JSON.parse(cachedUser) });
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

export const tokenRefresh = async(req,res) => {
  const {refreshToken} = req.body;
  try {
    if(!refreshToken) {
      return res.status(400).json({message:"Refresh token required"});
    }

    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const userId = decoded.id;
    
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

export default { register, login, logout, getUserDetail };
