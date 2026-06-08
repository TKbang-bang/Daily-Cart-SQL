import { createProductsService } from "./products.service.js";

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
