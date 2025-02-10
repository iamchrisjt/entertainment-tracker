import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.routes.js";
import movieRouter from "./routes/movie.routes.js";

import { connectDB } from "./utils/db.util.js";
import tvShowRouter from "./routes/tv-show.routes.js";
import gameRouter from "./routes/game.routes.js";

import { createServer } from "cors-anywhere";

import path from "path";

const __dirname = path.resolve();

// creates a new express server instance
const app = express();

app.use(express.json()); // middleware to parse json data
// CORS allows web servers to specify who can access their resources
app.use(cookieParser()); // middleware to parse cookies
app.use(cors({
    origin: process.env.ORIGIN || "http://localhost:5173", // allow all origins
    credentials: true  // allow cookies to be sent
})); // middleware to allow cross-origin requests

app.get("/api/health", (req, res) => {
    res.send({message: "Health OK"});
});

app.use("/api/auth", authRouter); // use the auth router
app.use("/api/track", movieRouter); // use the movie router
app.use("/api/track/", tvShowRouter); // use the tv show router
app.use("/api/track/", gameRouter); // use the game router

// serve the frontend files if in production
console.log("process.env.NODE_ENV: " + process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

connectDB(); // connect to the database

// start the server on port 7000
app.listen(process.env.PORT || 7000, () => {
    console.log("server started on " + process.env.PORT || 7000);
});

// Listen on a specific host via the HOST environment variable
var host = process.env.CORS_HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.CORS_PORT || 7001;

createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});