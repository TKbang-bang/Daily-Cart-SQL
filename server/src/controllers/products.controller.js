const ServerError = require("../Errors/errorClas");
const {
  creatingProduct,
  gettingProducts,
  getProductById,
  updatingProduct,
  searchingProduct,
  gettingProductsCategories,
  gettingProductsByCategory,
  AddOrRemoveToCart,
  countingCart,
} = require("../services/products.service");
const { getUserById } = require("../services/user.service");

const createProduct = async (req, res, next) => {
  try {
    // file from the user
    const { filename } = req.file;
    // product details
    const { name, description, category, price, stock, tags } = req.body;

    // verifying if the user is allowed to create a product
    const user = await getUserById(req.userId);
    if (!user) return next(new ServerError("User not found", 404));
    if (user.role != "admin" && user.role != "moderator")
      return next(
        new ServerError("You are not allowed to create a product", 403)
      );

    await creatingProduct({
      name,
      description,
      category,
      price,
      stock,
      tags: JSON.parse(tags),
      filename,
      userId: req.userId,
    });

    return res.status(200).json({ message: "Product created" });
  } catch (error) {
    console.log(error);
    return next(new ServerError(error.message, 500));
  }
};

const UpdateProduct = async (req, res, next) => {
  try {
    // product details
    const { id } = req.params;
    const { name, description, category, price, discount, stock, tags } =
      req.body;

    // check if the user is allowed to update a product
    const user = await getUserById(req.userId);
    if (!user) return next(new ServerError("User not found", 404));
    if (user.role != "admin" && user.role != "moderator")
      return next(
        new ServerError("You are not allowed to update a product", 403)
      );

    // updating product
    const product = await updatingProduct({
      id,
      name,
      description,
      category,
      price,
      discount,
      stock,
      tags,
      userId: req.userId,
    });
    if (!product.ok)
      return next(new ServerError(product.message, product.status));

    return res.status(200).json({ message: "Product updated" });
  } catch (error) {
    console.log(error);
    return next(new ServerError(error.message, 500));
  }
};

const getProducts = async (req, res, next) => {
  try {
    const products = await gettingProducts(req.userId);

    return res.status(200).json({ products });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await getProductById(req.userId, id);

    return res.status(200).json({ product });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

const getProductsCategories = async (req, res, next) => {
  try {
    const categories = await gettingProductsCategories();

    return res.status(200).json({ categories });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

const getPorductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const products = await gettingProductsByCategory(req.userId, category);

    return res.status(200).json({ products });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

const searchProduct = async (req, res, next) => {
  try {
    const { word } = req.params;

    const products = await searchingProduct(req.userId, word);

    return res.status(200).json({ products });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

const cartManagement = async (req, res, next) => {
  try {
    const { id } = req.params;

    const addOrRemove = await AddOrRemoveToCart(req.userId, id);

    return res.status(200).json({ added: addOrRemove.created });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

const countCart = async (req, res, next) => {
  try {
    const count = await countingCart(req.userId);
    return res.status(200).json({ count });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  UpdateProduct,
  searchProduct,
  getProductsCategories,
  getPorductsByCategory,
  cartManagement,
  countCart,
};
