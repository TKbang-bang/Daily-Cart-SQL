const ServerError = require("../Errors/errorClas");
const {
  commonSignUpService,
  commonLoginService,
} = require("../services/common.auth.service");
const { sendingCookieToken } = require("../services/cookies.service");
const { getUserByEmail } = require("../services/user.service");
const { createAccessToken, createRefreshToken } = require("../utils/token");
const bcrypt = require("bcrypt");

const commonSignupController = async (req, res, next) => {
  try {
    // credentials from the user
    const { firstName, lastName, email, password } = req.body;

    const user = await commonSignUpService(
      firstName,
      lastName,
      email,
      password,
    );

    // cerating tokens with the user id
    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    // sending tokens to the user
    return sendingCookieToken(res, accessToken, refreshToken);
  } catch (error) {
    return next(error);
  }
};
const commonLoginController = async (req, res, next) => {
  try {
    // credentials from the user
    const { email, password } = req.body;

    const user = await commonLoginService(email, password);

    // creating tokens with the user id
    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    // sending tokens to the user
    return sendingCookieToken(res, accessToken, refreshToken);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  commonSignupController,
  commonLoginController,
};
