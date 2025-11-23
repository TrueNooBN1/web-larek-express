import { Router } from 'express';
import { auth } from '../middlewares/auth';
import {
  getToken, getUser, login, logout, register,
} from '../controllers/auth';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.get('/token', getToken);
authRouter.get('/logout', logout);
authRouter.get('/user', auth, getUser);

export default authRouter;
