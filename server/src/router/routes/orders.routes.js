const {
  getOrders,
  updateOrderStatus,
} = require("../../controllers/orders.controller");

const ordersRoutes = require("express").Router();

ordersRoutes.get("/:status", getOrders);
ordersRoutes.put("/:orderId", updateOrderStatus);

module.exports = ordersRoutes;
