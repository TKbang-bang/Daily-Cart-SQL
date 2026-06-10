import { Router } from "express";
import {
  addOrRemoveToCartController,
  cartCountController,
  cartProductsController,
  deleteCartProductController,
  purchasedProductsController,
} from "./cart.controller.js";

const cartRoutes = Router();

// count the number of products in the cart
cartRoutes.get("/count", cartCountController);
// // add/remove product to cart
cartRoutes.put("/aor/:product_id", addOrRemoveToCartController);
// getting current cart
cartRoutes.get("/current", cartProductsController);
// // getting purchased products
cartRoutes.get("/purchased", purchasedProductsController);
// // deleting product from the cart
cartRoutes.delete("/:id", deleteCartProductController);

// // getting ordered products
// cartRoutes.get("/orders", purchasingProducts);

export default cartRoutes;
