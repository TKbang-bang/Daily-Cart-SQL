const { Order, User, Product, Order_item } = require("../../models");

const gettingOrders = async (status) => {
  try {
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

const updatingOrderStatus = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId);

    if (order.status == "paid") {
      await order.update({ status: "shipped" });
    } else if (order.status == "shipped") {
      await order.update({ status: "delivered" });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { gettingOrders, updatingOrderStatus };
