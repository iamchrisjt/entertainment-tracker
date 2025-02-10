import mongoose, { Document, Schema } from 'mongoose';

export interface ITvShow extends Document {
    tvShowID: string;
    rating: number;
    status: "plan to watch" | "watching" | "completed" | "dropped";
    notes: string;
}

const tvShowSchema = new Schema<ITvShow>({
    tvShowID: { type: String, required: true },
    rating: { type: Number },
    status: { type: String, enum: ["plan to watch", "watching", "completed", "dropped"] },
    notes: { type: String },
}, { timestamps: true });

const TvShow = mongoose.model<ITvShow>("TvShow", tvShowSchema);

export default TvShow;
