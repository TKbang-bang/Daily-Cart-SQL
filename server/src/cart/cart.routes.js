import { Router } from "express";
import { cartCountController } from "./cart.controller.js";

const cartRoutes = Router();

cartRoutes.get("/count", cartCountController);

export default cartRoutes;
