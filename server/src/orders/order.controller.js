import {
  getOrdersByStatusService,
  getOrdersService,
  updateFulfillmentStatusService,
} from "./orders.service.js";

export const getOrdersController = async (req, res, next) => {
  try {
    const { userID } = req;

    const orders = await getOrdersService(userID);

    return res.status(200).json({ products: orders });
  } catch (error) {
    return next(error);
  }
};

export const getOrdersByStatusController = async (req, res, next) => {
  try {
    const { userID } = req;
    const { status } = req.params;

    const orders = await getOrdersByStatusService(userID, status);

    return res.status(200).json({ orders });
  } catch (error) {
    return next(error);
  }
};

export const updateFulfillmentStatusController = async (req, res, next) => {
  try {
    const { fulfillment_id } = req.params;
    const { userID } = req;

    await updateFulfillmentStatusService(fulfillment_id, userID);

    return res.status(200).json({ message: "Fulfillment status updated" });
  } catch (error) {
    return next(error);
  }
};
