import {
  addOrRemoveToCartService,
  cartCountService,
  cartProductsService,
  deleteCartProductService,
  getPurchasedProductsService,
} from "./cart.service.js";

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

export const cartProductsController = async (req, res, next) => {
  try {
    const { userID } = req;

    const products = await cartProductsService(userID);

    return res.status(200).json({ products });
  } catch (error) {
    return next(error);
  }
};

export const deleteCartProductController = async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const { userID } = req;

    await deleteCartProductService(product_id, userID);

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

export const purchasedProductsController = async (req, res, next) => {
  try {
    const { userID } = req;

    const products = await getPurchasedProductsService(userID);

    return res.status(200).json({ products });
  } catch (error) {
    return next(error);
  }
};
