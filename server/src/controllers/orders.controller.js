const ServerError = require("../Errors/errorClas");
const {
  gettingOrders,
  updatingOrderStatus,
} = require("../services/orders.service");
const { getUserById } = require("../services/user.service");

const getOrders = async (req, res, next) => {
  try {
    // status from the url
    const { status } = req.params;
    if (!status) return next(new ServerError("Status not found", 404));

    // getting current user
    const user = await getUserById(req.userId);
    if (!user) return next(new ServerError("User not found", 404));

    // checking if the user is allowed
    if (user.role !== "admin" && user.role !== "manager")
      return next(new ServerError("You are not allowed", 403));

    // getting orders
    const orders = await gettingOrders(status);

    return res.status(200).json({ orders });
  } catch (error) {
    return next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    // order id from the url
    const { orderId } = req.params;

    // getting current user
    const user = await getUserById(req.userId);
    if (!user) return next(new ServerError("User not found", 404));

    // checking if the user is allowed
    if (user.role !== "admin" && user.role !== "manager")
      return next(new ServerError("You are not allowed", 403));

    // updating order status
    await updatingOrderStatus(req.userId, orderId);

    return res.status(200).json({ message: "Order status updated" });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getOrders, updateOrderStatus };
