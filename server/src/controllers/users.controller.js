const ServerError = require("../Errors/errorClas");
const {
  getUserById,
  gettingUsers,
  gettingLogs,
} = require("../services/user.service");

const getMe = async (req, res, next) => {
  try {
    // getting user
    const user = await getUserById(req.userId);
    if (!user) return next(new ServerError("User not found", 404));

    return res.status(200).json({ user });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

const getManagers = async (req, res, next) => {
  try {
    // getting the user
    const user = await getUserById(req.userId);
    if (!user) return next(new ServerError("User not found", 404));

    // checking if the user is allow to access
    if (user.role != "admin")
      return next(new ServerError("You are not allowed to see this", 403));

    // getting users (managers)
    const users = await gettingUsers();

    return res.status(200).json({ users });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

const getLogs = async (req, res, next) => {
  try {
    // getting the user
    const user = await getUserById(req.userId);
    if (!user) return next(new ServerError("User not found", 404));

    // checking if the user is allow to access
    if (user.role != "admin")
      return next(new ServerError("You are not allowed to see this", 403));

    // getting logs
    const logs = await gettingLogs();

    return res.status(200).json({ logs });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

module.exports = { getMe, getManagers, getLogs };
