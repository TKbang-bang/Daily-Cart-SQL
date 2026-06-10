import { Router } from "express";
import { getOrdersController } from "./order.controller.js";

const ordersRoutes = Router();

ordersRoutes.get("/", getOrdersController);

export default ordersRoutes;
