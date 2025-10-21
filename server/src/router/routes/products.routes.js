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
} = require("../../controllers/products.controller");
const { productsUpload } = require("../../utils/multer");

const productsRoutes = require("express").Router();

productsRoutes.post("/", productsUpload().single("image"), createProduct);
productsRoutes.put("/:id", UpdateProduct);
productsRoutes.get("/", getProducts);
productsRoutes.get("/categories", getProductsCategories);
productsRoutes.get("/categories/:category", getPorductsByCategory);
productsRoutes.get("/:id", getProduct);
productsRoutes.get("/search/:word", searchProduct);
productsRoutes.get("/cart/count", countCart);
productsRoutes.post("/cart/:id", cartManagement);

module.exports = productsRoutes;
