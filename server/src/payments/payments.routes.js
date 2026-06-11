import { Router } from "express";
import {
  createPaymentSessionController,
  paymentCancelController,
  paymentSuccessController,
} from "./paymnets.controller.js";

const paymentsRoutes = Router();

// creating payment session
paymentsRoutes.post("/session", createPaymentSessionController);
paymentsRoutes.post("/success/:orderId", paymentSuccessController);
paymentsRoutes.post("/cancel/:orderId", paymentCancelController);
// // success
// paymentRoutes.post("/success/:orderId", successPaymentSession);
// // cancel
// paymentRoutes.post("/cancel/:orderId", cancelOrder);

export default paymentsRoutes;
