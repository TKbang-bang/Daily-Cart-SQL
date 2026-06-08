import { Router } from "express";
import { productsUpload } from "../utils/multer.js";
import {
  createProductsController,
  getProductsController,
} from "./products.controller.js";
const productsRoutes = Router();

// creating product
productsRoutes.post(
  "/create",
  productsUpload().single("image"),
  createProductsController,
);
// // getting products
productsRoutes.get("/", getProductsController);
// updating product
// productsRoutes.put("/private/:id", UpdateProduct);
// // getting categories
// productsRoutes.get("/categories", getProductsCategories);
// // getting products by category
// productsRoutes.get("/categories/:category", getPorductsByCategory);
// // getting product
// productsRoutes.get("/:id", getProduct);
// // searching product
// productsRoutes.get("/search/:word", searchProduct);
// // counting cart products
// productsRoutes.get("/cart/count", countCart);
// // add/remove product to cart
// productsRoutes.post("/cart/:id", cartManagement);

export default productsRoutes;
