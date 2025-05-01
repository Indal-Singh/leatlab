import { Router } from "express";
import { getUser, login, logout, register } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const Route = Router();

// register route
Route.post('/register', register);
Route.post('/login', login);
Route.post('/logout',authMiddleware, logout);
Route.get('/me', authMiddleware, getUser);

export default Route;