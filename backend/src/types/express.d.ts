import { Request } from 'express';
import { mongoose } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: mongoose.Types.ObjectId;
      };
      userId?: mongoose.Types.ObjectId;
    }
  }
}

export {};
