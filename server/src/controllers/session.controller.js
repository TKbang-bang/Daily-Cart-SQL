const ServerError = require("../Errors/errorClas");
const { getUserById } = require("../services/user.service");

const sessionCheck = async (req, res, next) => {
  try {
    // check if the user exists in the database
    const user = await getUserById(req.userId);
    if (!user) return next(new ServerError("User not found", 404));

    return res.status(200).json({ message: "Be a good user" });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    req.userId = null;

    // clearing cookies
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

module.exports = { sessionCheck, logout };
