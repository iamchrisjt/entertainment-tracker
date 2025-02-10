import mongoose, { Document, Schema } from 'mongoose';

export interface IGame extends Document {
    gameID: string;
    rating: number;
    status: "plan to play" | "playing" | "finished" | "dropped";
    notes: string;
}

const gameSchema = new Schema<IGame>({
    gameID: { type: String, required: true },
    rating: { type: Number },
    status: { type: String, enum: ["plan to play", "playing", "finished", "dropped"] },
    notes: { type: String },
}, { timestamps: true });

const Game = mongoose.model<IGame>("Game", gameSchema);

export default Game;
