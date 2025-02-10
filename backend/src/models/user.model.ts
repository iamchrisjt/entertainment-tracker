import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document { // define the user interface
    name: string;
    email: string;
    password: string;
    movies: mongoose.Types.ObjectId[];
    tvShows: mongoose.Types.ObjectId[];
    games: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({ // create the user schema
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    movies: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
    tvShows: [{ type: Schema.Types.ObjectId, ref: "TvShow" }],
    games: [{ type: Schema.Types.ObjectId, ref: "Game" }]
}, { timestamps: true });

// create the user model
const User = mongoose.model<IUser>("User", userSchema);

export default User;
