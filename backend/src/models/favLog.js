import {Schema, model} from 'mongoose';
import { use } from 'react';

const favLogSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const FavLog = model('FavLog', favLogSchema);

export default FavLog;