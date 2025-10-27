const {
  Order,
  User,
  Product,
  Order_item,
  sequelize,
  Log,
} = require("../../models");

const gettingOrders = async (status) => {
  try {
    // getting orders
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstname", "lastname", "role"],
        },
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
                "stock",
                "image",
              ],
            },
          ],
        },
      ],
      where: {
        status: status,
      },
    });

    return orders;
  } catch (error) {
    throw error;
  }
};

const updatingOrderStatus = async (userId, orderId) => {
  try {
    // getting order
    const order = await Order.findByPk(orderId);

    // updating order status
    if (order.status == "paid") {
      await sequelize.transaction(async (transaction) => {
        // updating order status
        await order.update({ status: "shipped" }, { transaction });

        // creating log
        await Log.create(
          { userId, action: `Order ${orderId} shipped` },
          { transaction }
        );
      });
    } else if (order.status == "shipped") {
      await sequelize.transaction(async (transaction) => {
        // updating order status
        await order.update({ status: "delivered" }, { transaction });

        // creating log
        await Log.create(
          { userId, action: `Order ${orderId} delivered` },
          { transaction }
        );
      });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { gettingOrders, updatingOrderStatus };
