import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Response } from 'express';

dotenv.config(); // loads environment variables from a .env file into process.env

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (userID: string, res: Response) => { // generate a token
    const token = jwt.sign({ id: userID }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // cookie will only be accessible by the web server
        sameSite: 'strict', // cookie will only be set in the same origin
        secure: process.env.NODE_ENV !== 'production' // cookie will only be set in https in production
    })
};

export const verifyToken = (token: string) => { // verify a token
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) { 
        return null;
    }
};