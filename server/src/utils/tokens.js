import jwt from "jsonwebtoken";

export const createAccessToken = (userID) => {
  return jwt.sign({ userID }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (userID) => {
  return jwt.sign({ userID }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};
