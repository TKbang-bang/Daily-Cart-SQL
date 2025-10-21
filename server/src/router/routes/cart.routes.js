const cartRoutes = require("express").Router();

const {
  cartProducts,
  purchasingProducts,
  purchasedProducts,
  deleteProduct,
} = require("../../controllers/cart.controller");

cartRoutes.get("/current", cartProducts);
cartRoutes.get("/orders", purchasingProducts);
cartRoutes.get("/purchased", purchasedProducts);
cartRoutes.delete("/:id", deleteProduct);

module.exports = cartRoutes;
