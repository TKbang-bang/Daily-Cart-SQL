import { Router } from "express";
import {
  getLogsController,
  getManagersController,
  getMeController,
} from "./users.controller.js";

const usersRoutes = Router();

usersRoutes.get("/me", getMeController);
usersRoutes.get("/managers", getManagersController);
usersRoutes.get("/logs", getLogsController);

export default usersRoutes;
