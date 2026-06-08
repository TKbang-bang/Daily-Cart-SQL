import jwt from "jsonwebtoken";
import ServerError from "../errors/server.error.js";
import pool from "../db/db.js";
import { createAccessToken, createRefreshToken } from "../utils/tokens.js";
import { cookieOptions } from "../utils/cookies.js";

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
      const { userID } = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

      // verify if user id is in db
      const { rows: user } = await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [userID],
      );
      if (user.length === 0) return;

      // if access token is valid, set userId and proceed
      req.userID = userID;

      return next();
    } catch (error) {
      //   console.log("Invalid access token");
    }
  }

  // refresh token verification
  if (refreshToken) {
    try {
      // verify refresh token
      const { userID } = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
      );

      // verify if user id is in db
      const { rows: user } = await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [userID],
      );
      if (user.length === 0) {
        // clearing cookies
        res.clearCookie("refreshToken", {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
        });

        return next(new ServerError("User not found", 404));
      }

      // create new access and refresh tokens
      const newAccessToken = createAccessToken(userID);
      const newRefreshToken = createRefreshToken(userID);

      // set new tokens in response
      res.cookie("refreshToken", newRefreshToken, cookieOptions);
      res.setHeader("access-token", `Bearer ${newAccessToken}`);
      req.userID = userID;

      return next();
    } catch (error) {
      // console.log("Invalid refresh token");
      return next(new ServerError("Invalid refresh token", 401));
    }
  }
};

export default sessionMiddleware;
