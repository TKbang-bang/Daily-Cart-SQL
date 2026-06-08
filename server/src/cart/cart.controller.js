import { cartCountService } from "./cart.service.js";

export const cartCountController = async (req, res, next) => {
  try {
    const { userID } = req;

    const count = await cartCountService(userID);

    return res.status(200).json({ count });
  } catch (error) {
    return next(error);
  }
};
