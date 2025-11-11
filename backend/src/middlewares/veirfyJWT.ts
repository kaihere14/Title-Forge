import jwt, { Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "../controllers/useController.js";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET as Secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    req.userId = (decoded as TokenPayload).id;
    next();
  });
};

export default verifyJWT;
