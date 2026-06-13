import { Router } from "express";
import {
  getOrdersByStatusController,
  getOrdersController,
  updateFulfillmentStatusController,
} from "./order.controller.js";

const ordersRoutes = Router();

ordersRoutes.get("/", getOrdersController);
ordersRoutes.get("/:status", getOrdersByStatusController);
ordersRoutes.put("/:fulfillment_id", updateFulfillmentStatusController);

// getting orders by status
// ordersRoutes.get("/:status", getOrders);
// // updating order
// ordersRoutes.put("/:orderId", updateOrderStatus);

export default ordersRoutes;
