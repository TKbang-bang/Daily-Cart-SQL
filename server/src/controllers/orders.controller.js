const ServerError = require("../Errors/errorClas");
const {
  gettingOrders,
  updatingOrderStatus,
} = require("../services/orders.service");

const getOrders = async (req, res, next) => {
  try {
    const { status } = req.params;

    if (!status) return next(new ServerError("Status not found", 404));

    const orders = await gettingOrders(status);

    return res.status(200).json({ orders });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    await updatingOrderStatus(orderId);

    return res.status(200).json({ message: "Order status updated" });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

module.exports = { getOrders, updateOrderStatus };
