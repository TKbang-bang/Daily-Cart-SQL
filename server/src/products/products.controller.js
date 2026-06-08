import {
  createProductsService,
  getProductsService,
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
