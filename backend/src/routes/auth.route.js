import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
const Route = Router();

// register route
Route.post('/register', register);

export default Route;