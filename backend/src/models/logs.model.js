import { Schema ,model} from "mongoose";

const logSchema = new Schema(
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
const Log = model('Log', logSchema);
export default Log;