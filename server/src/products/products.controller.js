import {
  createProductsService,
  getCategoriesService,
  getProductsByAllCategoriesService,
  getProductsByCategoryService,
  getProductService,
  getProductsService,
  searchProductsService,
  updateProductsService,
} from "./products.service.js";

export const createProductsController = async (req, res, next) => {
  try {
    const { userID } = req;
    const { filename } = req.file;
    const { name, description, category, price, stock, tags } = req.body;

    await createProductsService(
      filename,
      name,
      description,
      category,
      price,
      stock,
      tags,
      userID,
    );

    return res.status(201).json({ message: "Product created" });
  } catch (error) {
    return next(error);
  }
};

export const getProductsController = async (req, res, next) => {
  try {
    const { userID } = req;

    const products = await getProductsService(userID);

    return res.status(200).json({ products });
  } catch (error) {
    return next(error);
  }
};

export const getProductController = async (req, res, next) => {
  try {
    const { userID } = req;
    const { id } = req.params;

    const product = await getProductService(id, userID);

    return res.status(200).json({ product });
  } catch (error) {
    return next(error);
  }
};

export const updateProductsController = async (req, res, next) => {
  try {
    const { userID } = req;
    const { id } = req.params;
    const { name, description, category, price, discount, stock, tags } =
      req.body;

    await updateProductsService(
      id,
      name,
      description,
      category,
      Number(price),
      Number(discount),
      Number(stock),
      tags,
      userID,
    );

    return res.status(200).json({ message: "Product updated" });
  } catch (error) {
    return next(error);
  }
};

export const getCategoriesController = async (req, res, next) => {
  try {
    const categories = await getCategoriesService();

    return res.status(200).json({ categories });
  } catch (error) {
    return next(error);
  }
};

export const getPorductsByCategoryController = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { userID } = req;

    let products;
    if (category === "all") {
      products = await getProductsByAllCategoriesService(userID);
    } else {
      products = await getProductsByCategoryService(category, userID);
    }

    return res.status(200).json({ products });
  } catch (error) {
    return next(error);
  }
};

export const searchProductsController = async (req, res, next) => {
  try {
    const { word } = req.params;
    const { userID } = req;

    const products = await searchProductsService(word, userID);

    return res.status(200).json({ products });
  } catch (error) {
    return next(error);
  }
};
