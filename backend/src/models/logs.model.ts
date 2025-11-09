import { Schema ,model ,Document} from "mongoose";

export interface ILog extends Document {
    name: string;
    oldTitles: string[];
    newTitles: string[];
    timestamp: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const logSchema = new Schema<ILog>(
    {
        name: { type: String, required: true },
        oldTitles: { type: [String], required: true },
        newTitles: { type: [String], required: true },
        timestamp: { type: Date, default: Date.now },
    },
    {
        timestamps: true
    }
);
const Log = model<ILog>("Log", logSchema);
export default Log;