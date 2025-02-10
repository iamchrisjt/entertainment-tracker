import { Request, RequestHandler, Response } from "express";
import User from "../models/user.model.js";
import TvShow from "../models/tv-show.model.js";

export const tvShows: RequestHandler = async (req: Request, res: Response) : Promise<any> => {
    const { limit, page } = req.query as { limit?: any, page?: any };

    try {
        const user = await req.body.user;
        if (!user) {
            return res.status(400).json({ message: "User not found." });
            // return res.status(401).json({ message: "Unauthorized access." });
        }
        const tvShows: any = await User.find({ _id: user._id }).populate("tvShows").select("tvShows");

        if (limit && page) {
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedTvShows = tvShows[0].tvShows.slice(startIndex, endIndex);
            return res.status(200).json({ message: "Tv Shows retrieved successfully.", tvShows: paginatedTvShows });
        }
        res.status(200).json({ message: " Tv Shows retrieved successfully.", tvShows: tvShows[0].tvShows });
    } catch (error) {
        console.log("Error in tv shows:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const addTvShow: RequestHandler = async (req: Request, res: Response) : Promise<any> => {
    const tvShowID = req.params.tvShowID;
    
    try {

        // check if the user exists
        const user = await req.body.user;
        if (!user) {
            return res.status(400).json({ message: "User not found." });
            // return res.status(401).json({ message: "Unauthorized access." });
        }

        // check if tvShow is already being tracked
        const searchUser = await User.findOne({ _id: user._id }).populate({ path: "tvShows", match: { tvShowID: tvShowID } }).select("tvShows").findOne();
        if (searchUser && searchUser.tvShows.length > 0) {
            return res.status(400).json({ message: "Tv Show already exists." });
        }

        const newTvShow = new TvShow({
            tvShowID: tvShowID,
        });
        await newTvShow.save();

        await User.findOneAndUpdate({ _id: user._id }, { $push: { tvShows: newTvShow._id } });
        res.status(200).json({ message: "Tv Show added successfully.", tvShow: newTvShow });
    } catch (error) {
        console.log("Error in add tv show:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const updateTvShow: RequestHandler = async (req: Request, res: Response) : Promise<any> => {
    const tvShowID = req.params.tvShowID;
    const { rating, notes, status } = req.body;

    try {
        // check if the user exists
        const user = await req.body.user;
        if (!user) {
            return res.status(400).json({ message: "User not found." });
            // return res.status(401).json({ message: "Unauthorized access." });
        }

        // check if tvShow is being tracked
        const searchUser : any = await User.findOne({ _id: user._id }).populate({ path: "tvShows", match: { tvShowID: tvShowID } }).select("tvShows").findOne();
        if (searchUser && searchUser.tvShows.length == 0) {
            return res.status(400).json({ message: "Tv Show does not exist." });
        }

        await TvShow.findOneAndUpdate({ _id: searchUser.tvShows[0]._id }, { $set: { rating: rating, notes: notes, status: status } });

        const tvShow = await TvShow.findOne({ _id: searchUser.tvShows[0]._id });

        res.status(200).json({ message: "Tv Show updated successfully.", tvShow });
    } catch (error) {
        console.log("Error in updating tv show:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const deleteTvShow: RequestHandler = async (req: Request, res: Response) : Promise<any> => {
    const tvShowID = req.params.tvShowID;

    try {
        // check if the user exists
        const user = await req.body.user;
        if (!user) {
            return res.status(400).json({ message: "User not found." });
            // return res.status(401).json({ message: "Unauthorized access." });
        }

        // check if tvShow is being tracked
        const searchUser : any= await User.findOne({ _id: user._id }).populate({ path: "tvShows", match: { tvShowID: tvShowID } }).select("tvShows").findOne();
        if (searchUser && searchUser.tvShows.length == 0) {
            return res.status(400).json({ message: "Tv Show does not exist." });
        }

        await User.findOneAndUpdate({ _id: user._id }, { $pull: { tvShows: searchUser.tvShows[0]._id } });
        await TvShow.deleteOne({ _id: searchUser.tvShows[0]._id });

        res.status(200).json({ message: "Tv Show deleted successfully." });
    } catch (error) {
        console.log("Error in deleting tv show:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const getTvShow: RequestHandler = async (req: Request, res: Response) : Promise<any> => {
    const tvShowID = req.params.tvShowID;
    const { checkingTracking } = req.query;

    try {
        // check if the user exists
        const user = await req.body.user;
        if (!user) {
            return res.status(400).json({ message: "User not found." });
            // return res.status(401).json({ message: "Unauthorized access." });
        }

        // check if tvShow is being tracked
        const searchUser : any= await User.findOne({ _id: user._id }).populate({ path: "tvShows", match: { tvShowID: tvShowID } }).select("tvShows").findOne();
        if (searchUser && searchUser.tvShows.length == 0) {
            if (checkingTracking && checkingTracking === "true") {
                return res.status(200).json({ tracking: false });
            }
            return res.status(400).json({ message: "Tv Show does not exist." });
        }

        if (checkingTracking && checkingTracking === "true") {
            return res.status(200).json({ tracking: true });
        }
        res.status(200).json({ message: "Tv Show retrieved successfully.", tvShow: searchUser.tvShows[0] });
    } catch (error) {
        console.log("Error in get tv show:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}