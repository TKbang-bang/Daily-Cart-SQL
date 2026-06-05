const {
  createProduct,
  getProducts,
  getProduct,
  UpdateProduct,
  searchProduct,
  getProductsCategories,
  getPorductsByCategory,
  cartManagement,
  countCart,
} = require("../controllers/products.controller");
const { productsUpload } = require("../utils/multer");

const productsRoutes = require("express").Router();

// creating product
productsRoutes.post(
  "/private",
  productsUpload().single("image"),
  createProduct,
);
// updating product
productsRoutes.put("/private/:id", UpdateProduct);
// getting products
productsRoutes.get("/", getProducts);
// getting categories
productsRoutes.get("/categories", getProductsCategories);
// getting products by category
productsRoutes.get("/categories/:category", getPorductsByCategory);
// getting product
productsRoutes.get("/:id", getProduct);
// searching product
productsRoutes.get("/search/:word", searchProduct);
// counting cart products
productsRoutes.get("/cart/count", countCart);
// add/remove product to cart
productsRoutes.post("/cart/:id", cartManagement);

module.exports = productsRoutes;
