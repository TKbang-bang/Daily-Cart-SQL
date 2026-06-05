const cartRoutes = require("express").Router();

const {
  cartProducts,
  purchasingProducts,
  purchasedProducts,
  deleteProduct,
} = require("../controllers/cart.controller");

// getting current cart
cartRoutes.get("/current", cartProducts);
// getting ordered products
cartRoutes.get("/orders", purchasingProducts);
// getting purchased products
cartRoutes.get("/purchased", purchasedProducts);
// deleting product from the cart
cartRoutes.delete("/:id", deleteProduct);

module.exports = cartRoutes;
