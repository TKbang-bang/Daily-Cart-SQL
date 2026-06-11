import { Router } from "express";
import { getOrdersController } from "./order.controller.js";

const ordersRoutes = Router();

ordersRoutes.get("/", getOrdersController);

// getting orders by status
// ordersRoutes.get("/:status", getOrders);
// // updating order
// ordersRoutes.put("/:orderId", updateOrderStatus);

export default ordersRoutes;
