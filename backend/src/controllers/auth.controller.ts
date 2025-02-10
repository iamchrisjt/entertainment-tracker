import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.util.js";

export const signup: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) { // if email or password is missing
            return res.status(400).json({ message: "All fields are required." });
        }
        if (password.length < 8) { // if the password is less than 8 characters
            return res.status(400).json({ message: "Password must be at least 8 characters." });
        }

        const user = await User.findOne({ email }); // find the user by email

        if (user) { // if the user already exists
            return res.status(400).json({ message: "Email is already in use." });
        }
        
        const salt = await bcrypt.genSalt(10); // generate a salt
        const hashedPassword = await bcrypt.hash(password, salt); // hash the password

        const newUser: any = new User({
            name,
            email,
            password: hashedPassword,
            movies: [],
            tvShows: [],
            games: []
        }); // create a new user

        if (newUser) {
            generateToken((newUser._id).toString(), res); // generate a token
            await newUser.save(); // save the user to the database
            res.status(201).json({ 
                message: "User created successfully.",
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                movies: newUser.movies
            });
        } else {
            res.status(400).json({ message: "Invalid user data." });
        }
    } catch (error : any) {
        console.log("Error in signup:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const login : RequestHandler = async (req: Request, res: Response) : Promise<any> => {
    const { email, password } = req.body;

    try {
        if (!email || !password) { // if email or password is missing
            return res.status(400).json({ message: "All fields are required." });
        }
        if (password.length < 8) { // if the password is less than 8 characters
            return res.status(400).json({ message: "Password must be at least 8 characters." });
        }

        const user : any = await User.findOne({ email }); // find the user by email

        if (!user) { // if the user does not exist
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password); // compare the password

        if (!isPasswordValid) { // if the password is invalid
            return res.status(400).json({ message: "Invalid credentials." });
        }

        generateToken(user._id.toString(), res); // generate a token

        res.status(200).json({ 
            message: "Login successful.",
            _id: user._id,
            name: user.name,
            email: user.email,
            movies: user.movies,
            tvShows: user.tvShows,
            games: user.games
        });
    } catch (error : any) {
        console.log("Error in login:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const logout = (req: Request, res: Response) => {
    try {
        res.clearCookie("token"); // clear the token cookie
        res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        console.log("Error in logout:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const checkAuth = (req: Request, res: Response) => {
    try {
        res.status(200).json({ message: "Protected route.", user: req.body.user});
    } catch (error) {
        console.log("Error in checkAuth:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}