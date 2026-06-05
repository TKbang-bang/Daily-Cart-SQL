const {
  getOrders,
  updateOrderStatus,
} = require("../controllers/orders.controller");

const ordersRoutes = require("express").Router();

// getting orders by status
ordersRoutes.get("/:status", getOrders);
// updating order
ordersRoutes.put("/:orderId", updateOrderStatus);

module.exports = ordersRoutes;
