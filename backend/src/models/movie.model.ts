import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
    movieID: string; 
    rating: number;
    status: "plan to watch" | "watching" | "completed" | "dropped";
    notes: string;
}

const movieSchema = new Schema<IMovie>({
    movieID: { type: String, required: true },
    rating: { type: Number },
    status: { type: String, enum: ["plan to watch", "watching", "completed", "dropped"] },
    notes: { type: String },
}, { timestamps: true });

const Movie = mongoose.model<IMovie>("Movie", movieSchema);

export default Movie;
