import { Request, Response, NextFunction, RequestHandler } from "express";
import User from "../models/user.model.js";
import { verifyToken } from "../utils/jwt.util.js";

export const authMiddleware : RequestHandler = async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
    try {
        const token = req.cookies.token; // get the token from the cookies

        if (!token) { // if there is no token
            res.status(401).json({ message: "Unauthorized access. (No token)" });
            return;
        }

        const decoded : any = verifyToken(token); // decode the token

        if (!decoded) { // if the token is invalid
            return res.status(401).json({ message: "Unauthorized access. (Invalid token)" });
        }

        const user = await User.findById(decoded.id).select("-password"); // find the user by id without the password

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        req.body.user = user; // add the user to the request object
        next(); // move to the next middleware/handler
        
    } catch (error) {
        console.error("Error in authMiddleware: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}