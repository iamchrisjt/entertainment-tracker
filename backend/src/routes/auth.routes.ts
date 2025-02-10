import express, {Request, Response} from 'express';
import { signup, login, logout, checkAuth } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/check', authMiddleware, checkAuth);

export default authRouter;