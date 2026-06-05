const jwt = require("jsonwebtoken");
const { createAccessToken, createRefreshToken } = require("../utils/token");
const cookiesOption = require("../utils/cookiesOption");
const ServerError = require("../Errors/errorClas");
const { User } = require("../../models");

const sessionMiddleware = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;

  // token verification
  if ((!accessToken || accessToken === "null") && !refreshToken) {
    return next(new ServerError("Unauthorized", 401));
  }

  // if both tokens are present, verify access token first
  if (accessToken && accessToken !== "null") {
    try {
      // verify access token
      const { id } = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

      // verify if user id is in db
      const user = await User.findByPk(id);
      if (!user) {
        // clearing cookies
        res.clearCookie("refreshToken", {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
        });
        return next(new ServerError("User not found", 404));
      }

      // if access token is valid, set userId and proceed
      req.userId = id;

      return next();
    } catch (error) {
      console.log("Invalid access token");
    }
  }

  // refresh token verification
  if (refreshToken) {
    try {
      // verify refresh token
      const { id } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // verify if user id is in db
      const user = await User.findByPk(id);
      if (!user) {
        // clearing cookies
        res.clearCookie("refreshToken", {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
        });
        return next(new ServerError("User not found", 404));
      }

      // create new access and refresh tokens
      const newAccessToken = createAccessToken(id);
      const newRefreshToken = createRefreshToken(id);

      // set new tokens in response
      res.cookie("refreshToken", newRefreshToken, cookiesOption);
      res.setHeader("access-token", `Bearer ${newAccessToken}`);
      req.userId = id;

      return next();
    } catch (error) {
      // console.log("Invalid refresh token");
      return next(new ServerError("Invalid refresh token", 401));
    }
  }
};

module.exports = sessionMiddleware;
