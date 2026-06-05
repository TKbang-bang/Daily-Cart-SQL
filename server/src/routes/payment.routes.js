const {
  createPaymentSession,
  successPaymentSession,
  cancelOrder,
} = require("../controllers/payment.controller");

const paymentRoutes = require("express").Router();

// creating payment session
paymentRoutes.post("/session/:productId", createPaymentSession);
// success
paymentRoutes.post("/success/:orderId", successPaymentSession);
// cancel
paymentRoutes.post("/cancel/:orderId", cancelOrder);

module.exports = paymentRoutes;
