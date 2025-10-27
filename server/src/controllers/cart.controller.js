const ServerError = require("../Errors/errorClas");
const {
  getCurrentCartProducts,
  getPurchasingCartProducts,
  getPurchasedCartProducts,
  deletingCartProduct,
} = require("../services/cart.service");

const cartProducts = async (req, res, next) => {
  try {
    // getting products
    const products = await getCurrentCartProducts(req.userId);

    return res.status(200).json({ products });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

const purchasingProducts = async (req, res, next) => {
  try {
    // getting purchasing products
    const products = await getPurchasingCartProducts(req.userId);

    return res.status(200).json({ products });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

const purchasedProducts = async (req, res, next) => {
  try {
    // getting purchased products
    const products = await getPurchasedCartProducts(req.userId);

    return res.status(200).json({ products });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    // deleting product from cart
    await deletingCartProduct(req.userId, req.params.id);

    return res.status(204).end();
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

module.exports = {
  cartProducts,
  purchasingProducts,
  purchasedProducts,
  deleteProduct,
};
