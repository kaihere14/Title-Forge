import { Request } from 'express';
import { mongoose } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: Types.ObjectId;
      };
      userId?: Types.ObjectId;
    }
  }
}

export {};
