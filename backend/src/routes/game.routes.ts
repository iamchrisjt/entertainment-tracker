import express, {Request, Response} from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { addGame, games, deleteGame, updateGame, getGame } from '../controllers/game.controller.js';

const gameRouter = express.Router();

gameRouter.get('/games', authMiddleware, games);
gameRouter.get('/game/:gameID', authMiddleware, getGame);
gameRouter.post('/add-game/:gameID', authMiddleware, addGame);
gameRouter.put('/update-game/:gameID', authMiddleware, updateGame);
gameRouter.delete('/delete-game/:gameID', authMiddleware, deleteGame);

export default gameRouter;