import { getOrdersService } from "./orders.service.js";

export const getOrdersController = async (req, res, next) => {
  try {
    const { userID } = req;

    const orders = await getOrdersService(userID);

    return res.status(200).json({ products: orders });
  } catch (error) {
    return next(error);
  }
};
