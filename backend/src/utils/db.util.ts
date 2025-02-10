import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // loads environment variables from a .env file into process.env

export const connectDB = async () => {
    try { // try to connect to the database
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
        console.log("connected to the database");
    } catch (error) { // if there is an error connecting to the database
        console.error("error connecting to the database: ", error);
        process.exit(1);
    }
}