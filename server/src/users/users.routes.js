import { Router } from "express";
import { getMeController } from "./users.controller.js";

const usersRoutes = Router();

usersRoutes.get("/me", getMeController);

export default usersRoutes;
