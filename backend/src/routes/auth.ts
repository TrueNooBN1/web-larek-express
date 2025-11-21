import { auth } from "../middlewares/auth";
import { getToken, getUser, login, logout, register } from "../controllers/auth";
import { Router } from "express";

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/token', getToken);
router.get('/logout', logout);
router.get('/user', auth, getUser);

export {router as authRouter};