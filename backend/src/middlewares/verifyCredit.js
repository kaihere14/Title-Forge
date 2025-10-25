import User from "../models/user.model.js";

const verifyCredit = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.credits <= 0) {
      return res.status(403).json({ message: "Insufficient credits" });
    }

   

    next();
  } catch (error) {
    console.error("Error in verifyCredit middleware:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default verifyCredit;
