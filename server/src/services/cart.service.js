const { Op } = require("sequelize");
const {
  Product,
  Cart,
  Order,
  Order_item,
  sequelize,
  Log,
} = require("../../models");

const getCurrentCartProducts = async (userId) => {
  try {
    // getting products
    const products = await Cart.findAll({
      where: { userId, status: "active" },
      include: [{ model: Product, as: "product" }],
    });

    // formatting products
    return products.map((product) => {
      return {
        id: product.product.id,
        name: product.product.name,
        description: product.product.description,
        price: product.product.price,
        discount: product.product.discount,
        stock: product.product.stock,
        image: product.product.image,
      };
    });
  } catch (error) {
    throw error;
  }
};

const getPurchasingCartProducts = async (userId) => {
  try {
    // getting orders with items
    const orders = await Order.findAll({
      include: [
        {
          model: Order_item,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: [
                "id",
                "name",
                "description",
                "price",
                "discount",
                "stock",
                "image",
              ],
            },
          ],
        },
      ],
      where: {
        userId,
        [Op.or]: [{ status: "paid" }, { status: "shipped" }],
      },
    });

    // formatting products
    return orders.flatMap((order) => {
      return order.items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        discount: item.product.discount,
        stock: item.product.stock,
        image: item.product.image,
      }));
    });
  } catch (error) {
    throw error;
  }
};

const getPurchasedCartProducts = async (userId) => {
  try {
    // getting orders with items
    const orders = await Order.findAll({
      include: [
        {
          model: Order_item,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: [
                "id",
                "name",
                "description",
                "price",
                "discount",
                "stock",
                "image",
              ],
            },
          ],
        },
      ],
      where: {
        userId,
        status: "delivered",
      },
    });

    // formatting products
    return orders.flatMap((order) => {
      return order.items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        discount: item.product.discount,
        stock: item.product.stock,
        image: item.product.image,
      }));
    });
  } catch (error) {
    throw error;
  }
};

const deletingCartProduct = async (userId, productId) => {
  try {
    // deleting product
    await Cart.destroy({ where: { userId, productId } });
  } catch (error) {
    throw error;
  }
};

const creatingOrder = async (userId, productId) => {
  try {
    // creating full order
    const fullOrder = await sequelize.transaction(async (transaction) => {
      // getting the product
      const product = await Product.findByPk(productId, {
        attributes: ["id", "price", "discount"],
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!product) {
        throw new Error("Product not found");
      }

      // updating the product status in cart
      await Cart.update(
        { status: "purchasing" },
        { where: { userId, productId }, transaction },
      );

      // creating order
      const order = await Order.create(
        {
          userId,
          total: product.price - (product.discount || 0),
        },
        { transaction },
      );

      // items in order
      await Order_item.create(
        {
          orderId: order.id,
          productId,
          quantity: 1,
          price: product.price,
          discount: product.discount,
        },
        { transaction },
      );

      await Log.create(
        {
          userId,
          message: `Order created with id ${order.id}`,
          action: "Order created",
        },
        { transaction },
      );

      // order id
      return order.id;
    });

    return fullOrder;
  } catch (error) {
    throw error;
  }
};

const addPaymentIdToOrder = async (orderId, paymentId) => {
  try {
    // updating the order
    await Order.update({ paymentId }, { where: { id: orderId } });
  } catch (error) {
    throw error;
  }
};

const successPayment = async (userId, orderId) => {
  try {
    // updating the order and product and cart status
    await sequelize.transaction(async (transaction) => {
      // updating the order status
      await Order.update(
        { status: "paid" },
        { where: { id: orderId, userId }, transaction },
      );
      // getting the product id
      const productId = await Order_item.findOne({
        where: { orderId },
        attributes: ["productId"],
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      // updating the product status in cart
      await Cart.update(
        { status: "purchased" },
        { where: { userId, productId: productId.productId }, transaction },
      );

      // update product stock
      await Product.decrement("stock", {
        by: 1,
        where: { id: productId.productId },
        transaction,
      });

      // creating log
      await Log.create(
        {
          userId,
          message: `Order with id ${orderId} has been paid`,
        },
        { transaction },
      );
    });
  } catch (error) {
    throw error;
  }
};

const cancellingOrder = async (userId, orderId) => {
  try {
    // updating the order and product and cart status
    await sequelize.transaction(async (transaction) => {
      // cancelling the order
      await Order.update(
        { status: "cancelled" },
        { where: { id: orderId, userId }, transaction },
      );

      // getting the product id
      const productId = await Order_item.findOne({
        where: { orderId },
        attributes: ["productId"],
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      // updating the product status in cart
      await Cart.update(
        { status: "active" },
        { where: { userId, productId: productId.productId }, transaction },
      );

      // creating log
      await Log.create(
        {
          userId,
          message: `Order with id ${orderId} has been cancelled`,
        },
        { transaction },
      );
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getCurrentCartProducts,
  getPurchasingCartProducts,
  getPurchasedCartProducts,
  deletingCartProduct,
  // buyFromCart,
  creatingOrder,
  addPaymentIdToOrder,
  successPayment,
  cancellingOrder,
};
