import { Request, RequestHandler, Response } from "express";
import User from "../models/user.model.js";
import Movie from "../models/movie.model.js";

export const movies: RequestHandler = async (req: Request, res: Response) : Promise<any> => {
    const { limit, page } = req.query as { limit?: any, page?: any };

    try {
        const user = await req.body.user;
        if (!user) {
            return res.status(400).json({ message: "User not found." });
            // return res.status(401).json({ message: "Unauthorized access." });
        }
        const movies: any = await User.find({ _id: user._id }).populate("movies").select("movies");

        if (limit && page) {
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedMovies = movies[0].movies.slice(startIndex, endIndex);
            return res.status(200).json({ message: "Movies retrieved successfully.", movies: paginatedMovies });
        }
        res.status(200).json({ message: "Movies retrieved successfully.", movies: movies[0].movies });
    } catch (error) {
        console.log("Error in movies:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const addMovie: RequestHandler = async (req: Request, res: Response) : Promise<any> => {
    const movieID = req.params.movieID;
    
    try {

        // check if the user exists
        const user = await req.body.user;
        if (!user) {
            return res.status(400).json({ message: "User not found." });
            // return res.status(401).json({ message: "Unauthorized access." });
        }

        // check if movie is already being tracked
        const searchUser = await User.findOne({ _id: user._id }).populate({ path: "movies", match: { movieID: movieID } }).select("movies").findOne();
        if (searchUser && searchUser.movies.length > 0) {
            return res.status(400).json({ message: "Movie already exists." });
        }

        const newMovie = new Movie({
            movieID: movieID,
        });
        await newMovie.save();

        await User.findOneAndUpdate({ _id: user._id }, { $push: { movies: newMovie._id } });
        res.status(200).json({ message: "Movie added successfully.", movie: newMovie });
    } catch (error) {
        console.log("Error in addMovie:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const updateMovie: RequestHandler = async (req: Request, res: Response) : Promise<any> => {
    const movieID = req.params.movieID;
    const { rating, notes, status } = req.body;

    try {
        // check if the user exists
        const user = await req.body.user;
        if (!user) {
            return res.status(400).json({ message: "User not found." });
            // return res.status(401).json({ message: "Unauthorized access." });
        }

        // check if movie is being tracked
        const searchUser : any = await User.findOne({ _id: user._id }).populate({ path: "movies", match: { movieID: movieID } }).select("movies").findOne();
        if (searchUser && searchUser.movies.length == 0) {
            return res.status(400).json({ message: "Movie does not exist." });
        }

        await Movie.findOneAndUpdate({ _id: searchUser.movies[0]._id }, { $set: { rating: rating, notes: notes, status: status } });

        const movie = await Movie.findOne({ _id: searchUser.movies[0]._id });

        res.status(200).json({ message: "Movie updated successfully.", movie });
    } catch (error) {
        console.log("Error in updateMovie:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const deleteMovie: RequestHandler = async (req: Request, res: Response) : Promise<any> => {
    const movieID = req.params.movieID;

    try {
        // check if the user exists
        const user = await req.body.user;
        if (!user) {
            return res.status(400).json({ message: "User not found." });
            // return res.status(401).json({ message: "Unauthorized access." });
        }

        // check if movie is being tracked
        const searchUser : any= await User.findOne({ _id: user._id }).populate({ path: "movies", match: { movieID: movieID } }).select("movies").findOne();
        if (searchUser && searchUser.movies.length == 0) {
            return res.status(400).json({ message: "Movie does not exist." });
        }

        await User.findOneAndUpdate({ _id: user._id }, { $pull: { movies: searchUser.movies[0]._id } });
        await Movie.deleteOne({ _id: searchUser.movies[0]._id });

        res.status(200).json({ message: "Movie deleted successfully." });
    } catch (error) {
        console.log("Error in deleteMovie:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const getMovie: RequestHandler = async (req: Request, res: Response) : Promise<any> => {
    const movieID = req.params.movieID;
    const { checkingTracking } = req.query;

    try {
        // check if the user exists
        const user = await req.body.user;
        if (!user) {
            return res.status(400).json({ message: "User not found." });
            // return res.status(401).json({ message: "Unauthorized access." });
        }

        // check if movie is being tracked
        const searchUser : any= await User.findOne({ _id: user._id }).populate({ path: "movies", match: { movieID: movieID } }).select("movies").findOne();
        if (searchUser && searchUser.movies.length == 0) {
            if (checkingTracking && checkingTracking === "true") {
                return res.status(200).json({ tracking: false });
            }
            return res.status(400).json({ message: "Movie does not exist." });
        }

        if (checkingTracking && checkingTracking === "true") {
            return res.status(200).json({ tracking: true });
        }
        res.status(200).json({ message: "Movie retrieved successfully.", movie: searchUser.movies[0] });
    } catch (error) {
        console.log("Error in getMovie:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}