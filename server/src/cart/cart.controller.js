import { addOrRemoveToCartService, cartCountService } from "./cart.service.js";

export const cartCountController = async (req, res, next) => {
  try {
    const { userID } = req;

    const count = await cartCountService(userID);

    return res.status(200).json({ count });
  } catch (error) {
    return next(error);
  }
};

export const addOrRemoveToCartController = async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const { userID } = req;

    const aor = await addOrRemoveToCartService(product_id, userID);

    return res.status(200).json({ added: aor.created });
  } catch (error) {
    return next(error);
  }
};
