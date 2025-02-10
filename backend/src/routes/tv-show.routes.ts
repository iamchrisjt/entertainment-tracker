import express, {Request, Response} from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { addTvShow, tvShows, deleteTvShow, updateTvShow, getTvShow } from '../controllers/tv-show.controller.js';

const tvShowRouter = express.Router();

tvShowRouter.get('/tv-shows', authMiddleware, tvShows);
tvShowRouter.get('/tv-show/:tvShowID', authMiddleware, getTvShow);
tvShowRouter.post('/add-tv-show/:tvShowID', authMiddleware, addTvShow);
tvShowRouter.put('/update-tv-show/:tvShowID', authMiddleware, updateTvShow);
tvShowRouter.delete('/delete-tv-show/:tvShowID', authMiddleware, deleteTvShow);

export default tvShowRouter;