const { Op, where, fn } = require("sequelize");
const {
  sequelize,
  Category,
  Product,
  Tag,
  Log,
  Cart,
} = require("../../models");

const creatingProduct = async ({
  name,
  description,
  category,
  price,
  stock,
  tags,
  filename,
  userId,
}) => {
  try {
    await sequelize.transaction(async (transaction) => {
      let categoryId;
      // creating category
      const getCategory = await Category.findOne({
        where: {
          name: { [Op.iLike]: category },
        },
        transaction,
      });
      if (!getCategory) {
        const newCategory = await Category.create(
          { name: category },
          {
            transaction,
          }
        );
        categoryId = newCategory.id;
      } else {
        categoryId = getCategory.id;
      }

      // creating product
      const product = await Product.create(
        {
          name,
          description,
          categoryId,
          price,
          stock,
          image: filename,
        },
        {
          transaction,
        }
      );

      // creating products tags
      for (let tagName of tags) {
        const [tag] = await Tag.findOrCreate({
          where: { name: tagName },
          transaction,
        });

        await product.addTag(tag, { transaction });
      }

      await Log.create({
        userId,
        action: "created a product",
      });
    });
  } catch (error) {
    throw error;
  }
};

const updatingProduct = async ({
  id,
  name,
  description,
  category,
  price,
  discount,
  stock,
  tags,
  userId,
}) => {
  try {
    // upadating the product using transaction
    const result = await sequelize.transaction(async (transaction) => {
      // declaring variables for category id
      let categoryId;
      // getting category
      const getCategory = await Category.findOne({
        where: {
          name: { [Op.iLike]: category },
        },
        transaction,
      });
      if (!getCategory) {
        // creating category
        const newCategory = await Category.create(
          { name: category },
          {
            transaction,
          }
        );
        // assigning category id
        categoryId = newCategory.id;
      } else {
        // assigning category id
        categoryId = getCategory.id;
      }

      // getting product
      const product = await Product.findByPk(id, {
        transaction,
      });
      if (!product)
        return { ok: false, message: "Product not found", status: 404 };

      // checking if the discount is greater than or equal to the price
      if (discount && discount >= price) {
        return {
          ok: false,
          message: "Discount can't be greater than or equal to the price",
          status: 400,
        };
      }

      // assigning discount
      let discountValue = discount > 0 ? discount : null;

      // updating product
      await product.update(
        {
          name,
          description,
          categoryId,
          price,
          discount: discountValue,
          stock,
        },
        {
          transaction,
        }
      );

      // creating or updating products tags
      for (let tagName of tags) {
        const [tag] = await Tag.findOrCreate({
          where: { name: tagName },
          transaction,
        });

        await product.addTag(tag, { transaction });
      }

      // creating logs
      await Log.create({
        userId,
        action: "updated a product",
      });

      return { ok: true };
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const gettingProducts = async (userId) => {
  try {
    const products = await Product.findAll({
      attributes: [
        "id",
        "name",
        "description",
        "price",
        "discount",
        "stock",
        "image",
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM "Carts" WHERE "Carts"."productId" = "Product"."id" AND "Carts"."userId" = '${userId}')`
          ),
          "inCart",
        ],
      ],
      include: [
        { model: Category, attributes: ["name"], as: "category" },
        { model: Tag, attributes: ["name"], as: "tags" },
      ],
    });

    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      image: product.image,
      category: product.category?.name || null,
      tags: product.tags.map((tag) => tag.name),
      inCart: Number(product.get("inCart")) > 0,
    }));

    return formattedProducts;
  } catch (error) {
    throw error;
  }
};

const getProductById = async (userId, productId) => {
  try {
    const product = await Product.findByPk(productId, {
      attributes: [
        "id",
        "name",
        "description",
        "price",
        "discount",
        "stock",
        "image",
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM "Carts" WHERE "Carts"."productId" = "Product"."id" AND "Carts"."userId" = '${userId}')`
          ),
          "inCart",
        ],
      ],
      include: [
        { model: Category, attributes: ["name"], as: "category" },
        { model: Tag, attributes: ["name"], as: "tags" },
      ],
    });

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      image: product.image,
      category: product.category?.name || null,
      tags: product.tags.map((tag) => tag.name),
      inCart: Number(product.get("inCart")) > 0,
    };
  } catch (error) {
    throw error;
  }
};

const searchingProduct = async (userId, word) => {
  try {
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${word}%` } },
          { "$category.name$": { [Op.iLike]: `%${word}%` } },
          { "$tags.name$": { [Op.iLike]: `%${word}%` } },
        ],
      },
      attributes: [
        "id",
        "name",
        "description",
        "price",
        "discount",
        "stock",
        "image",
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM "Carts" WHERE "Carts"."productId" = "Product"."id" AND "Carts"."userId" = '${userId}')`
          ),
          "inCart",
        ],
      ],
      include: [
        { model: Category, as: "category", attributes: ["name"] },
        { model: Tag, as: "tags", attributes: ["name"] },
      ],
      distinct: true,
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      image: product.image,
      category: product.category?.name || null,
      tags: product.tags.map((tag) => tag.name),
      inCart: Number(product.get("inCart")) > 0,
    }));
  } catch (error) {
    throw error;
  }
};

const gettingProductsCategories = async () => {
  try {
    const categories = await Category.findAll();

    return categories;
  } catch (error) {
    throw error;
  }
};

const gettingProductsByCategory = async (userId, category) => {
  try {
    const products = await Product.findAll({
      where: {
        "$category.name$": {
          [Op.iLike]: `%${category}%`,
        },
      },
      attributes: [
        "id",
        "name",
        "description",
        "price",
        "discount",
        "stock",
        "image",
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM "Carts" WHERE "Carts"."productId" = "Product"."id" AND "Carts"."userId" = '${userId}')`
          ),
          "inCart",
        ],
      ],
      include: [{ model: Category, as: "category", attributes: ["name"] }],
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      image: product.image,
      category: product.category?.name || null,
      inCart: Number(product.get("inCart")) > 0,
    }));
  } catch (error) {
    throw error;
  }
};

const AddOrRemoveToCart = async (userId, productId) => {
  try {
    const existing = await Cart.findOne({
      where: { userId, productId },
    });

    if (!existing) {
      await Cart.create({ userId, productId });
      return { created: true };
    } else {
      await Cart.destroy({ where: { userId, productId } });
      return { created: false };
    }
  } catch (error) {
    throw error;
  }
};

const countingCart = async (userId) => {
  try {
    const cart = await Cart.count({ where: { userId } });
    return cart;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  creatingProduct,
  gettingProducts,
  getProductById,
  updatingProduct,
  searchingProduct,
  gettingProductsCategories,
  gettingProductsByCategory,
  AddOrRemoveToCart,
  countingCart,
};
