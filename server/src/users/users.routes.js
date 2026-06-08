import { Router } from "express";
import { getManagersController, getMeController } from "./users.controller.js";

const usersRoutes = Router();

usersRoutes.get("/me", getMeController);
usersRoutes.get("/managers", getManagersController);

export default usersRoutes;
