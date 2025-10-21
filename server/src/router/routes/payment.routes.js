const {
  createPaymentSession,
  successPaymentSession,
  cancelOrder,
} = require("../../controllers/payment.controller");

const paymentRoutes = require("express").Router();

paymentRoutes.post("/session/:productId", createPaymentSession);
paymentRoutes.post("/success/:orderId", successPaymentSession);
paymentRoutes.post("/cancel/:orderId", cancelOrder);

module.exports = paymentRoutes;
