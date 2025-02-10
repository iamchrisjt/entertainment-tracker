import express, {Request, Response} from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { addMovie, movies, deleteMovie, updateMovie, getMovie } from '../controllers/movie.controller.js';

const movieRouter = express.Router();

movieRouter.get('/movies', authMiddleware, movies);
movieRouter.get('/movie/:movieID', authMiddleware, getMovie);
movieRouter.post('/add-movie/:movieID', authMiddleware, addMovie);
movieRouter.put('/update-movie/:movieID', authMiddleware, updateMovie);
movieRouter.delete('/delete-movie/:movieID', authMiddleware, deleteMovie);

export default movieRouter;