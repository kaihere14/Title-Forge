import mongoose, {Schema, model ,Document} from 'mongoose';

export interface IFavLog  extends Document{
    userId: mongoose.Schema.Types.ObjectId;
    title: string;
    createdAt?: Date;
}
const favLogSchema = new Schema<IFavLog>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const FavLog = model<IFavLog>("FavLog", favLogSchema);

export default FavLog;