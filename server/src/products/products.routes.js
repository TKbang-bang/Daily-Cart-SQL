import { Router } from "express";
import { productsUpload } from "../utils/multer.js";
import {
  createProductsController,
  getCategoriesController,
  getPorductsByCategoryController,
  getProductController,
  getProductsController,
  updateProductsController,
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
// // getting categories
productsRoutes.get("/categories", getCategoriesController);
// // getting products by category
productsRoutes.get("/categories/:category", getPorductsByCategoryController);
// // getting product
productsRoutes.get("/:id", getProductController);
// updating product
productsRoutes.put("/:id", updateProductsController);

// // searching product
// productsRoutes.get("/search/:word", searchProduct);
// // counting cart products
// productsRoutes.get("/cart/count", countCart);
// // add/remove product to cart
// productsRoutes.post("/cart/:id", cartManagement);

export default productsRoutes;
