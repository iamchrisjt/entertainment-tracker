import { Request, RequestHandler, Response } from "express";
import User from "../models/user.model.js";
import Game from "../models/game.model.js";

export const games: RequestHandler = async (req: Request, res: Response) : Promise<any> => {
    const { limit, page } = req.query as { limit?: any, page?: any };

    try {
        const user = await req.body.user;
        if (!user) {
            return res.status(400).json({ message: "User not found." });
            // return res.status(401).json({ message: "Unauthorized access." });
        }
        const games: any = await User.find({ _id: user._id }).populate("games").select("games");

        if (limit && page) {
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedGames = games[0].games.slice(startIndex, endIndex);
            return res.status(200).json({ message: "Games retrieved successfully.", games: paginatedGames });
        }
        res.status(200).json({ message: "Game retrieved successfully.", games: games[0].games });
    } catch (error) {
        console.log("Error in game:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const addGame: RequestHandler = async (req: Request, res: Response) : Promise<any> => {
    const gameID = req.params.gameID;
    
    try {

        // check if the user exists
        const user = await req.body.user;
        if (!user) {
            return res.status(400).json({ message: "User not found." });
            // return res.status(401).json({ message: "Unauthorized access." });
        }

        // check if game is already being tracked
        const searchUser = await User.findOne({ _id: user._id }).populate({ path: "games", match: { gameID: gameID } }).select("games").findOne();
        if (searchUser && searchUser.games.length > 0) {
            return res.status(400).json({ message: "Game already exists." });
        }

        const newGame = new Game({
            gameID: gameID,
        });
        await newGame.save();

        await User.findOneAndUpdate({ _id: user._id }, { $push: { games: newGame._id } });
        res.status(200).json({ message: "Game added successfully.", game: newGame });
    } catch (error) {
        console.log("Error in add game:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const updateGame: RequestHandler = async (req: Request, res: Response) : Promise<any> => {
    const gameID = req.params.gameID;
    const { rating, notes, status } = req.body;

    try {
        // check if the user exists
        const user = await req.body.user;
        if (!user) {
            return res.status(400).json({ message: "User not found." });
            // return res.status(401).json({ message: "Unauthorized access." });
        }

        // check if game is being tracked
        const searchUser : any = await User.findOne({ _id: user._id }).populate({ path: "games", match: { gameID: gameID } }).select("games").findOne();
        if (searchUser && searchUser.games.length == 0) {
            return res.status(400).json({ message: "Game does not exist." });
        }

        await Game.findOneAndUpdate({ _id: searchUser.games[0]._id }, { $set: { rating: rating, notes: notes, status: status } });

        const game = await Game.findOne({ _id: searchUser.games[0]._id });

        res.status(200).json({ message: "Game updated successfully.", game });
    } catch (error) {
        console.log("Error in updating game:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const deleteGame: RequestHandler = async (req: Request, res: Response) : Promise<any> => {
    const gameID = req.params.gameID;

    try {
        // check if the user exists
        const user = await req.body.user;
        if (!user) {
            return res.status(400).json({ message: "User not found." });
            // return res.status(401).json({ message: "Unauthorized access." });
        }

        // check if game is being tracked
        const searchUser : any= await User.findOne({ _id: user._id }).populate({ path: "games", match: { gameID: gameID } }).select("games").findOne();
        if (searchUser && searchUser.games.length == 0) {
            return res.status(400).json({ message: "Game does not exist." });
        }

        await User.findOneAndUpdate({ _id: user._id }, { $pull: { games: searchUser.games[0]._id } });
        await Game.deleteOne({ _id: searchUser.games[0]._id });

        res.status(200).json({ message: "Game deleted successfully." });
    } catch (error) {
        console.log("Error in deleting game:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const getGame: RequestHandler = async (req: Request, res: Response) : Promise<any> => {
    const gameID = req.params.gameID;
    const { checkingTracking } = req.query;

    try {
        // check if the user exists
        const user = await req.body.user;
        if (!user) {
            return res.status(400).json({ message: "User not found." });
            // return res.status(401).json({ message: "Unauthorized access." });
        }

        // check if game is being tracked
        const searchUser : any= await User.findOne({ _id: user._id }).populate({ path: "games", match: { gameID: gameID } }).select("games").findOne();
        if (searchUser && searchUser.games.length == 0) {
            if (checkingTracking && checkingTracking === "true") {
                return res.status(200).json({ tracking: false });
            }
            return res.status(400).json({ message: "Game does not exist." });
        }

        if (checkingTracking && checkingTracking === "true") {
            return res.status(200).json({ tracking: true });
        }
        res.status(200).json({ message: "Game retrieved successfully.", game: searchUser.games[0] });
    } catch (error) {
        console.log("Error in get game:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}