import {
  createPaymentSessionService,
  paymentCancelService,
  paymentSuccessService,
} from "./payment.service.js";

export const createPaymentSessionController = async (req, res, next) => {
  try {
    const { id, quantity } = req.query;
    const { userID } = req;

    const url = await createPaymentSessionService(id, quantity, userID);

    return res.status(200).json({ url });
  } catch (error) {
    return next(error);
  }
};

export const paymentSuccessController = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { userID } = req;

    await paymentSuccessService(orderId, userID);

    return res.status(200).json({ message: "Payment successful" });
  } catch (error) {
    return next(error);
  }
};

export const paymentCancelController = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { userID } = req;

    await paymentCancelService(orderId, userID);

    return res.status(200).json({ message: "Payment cancelled" });
  } catch (error) {
    return next(error);
  }
};
