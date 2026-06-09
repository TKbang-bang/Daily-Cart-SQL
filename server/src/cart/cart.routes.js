import { Router } from "express";
import {
  addOrRemoveToCartController,
  cartCountController,
} from "./cart.controller.js";

const cartRoutes = Router();

cartRoutes.get("/count", cartCountController);
cartRoutes.put("/aor/:product_id", addOrRemoveToCartController);
// // add/remove product to cart
// productsRoutes.post("/cart/:id", cartManagement);

export default cartRoutes;
