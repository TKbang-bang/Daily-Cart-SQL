const { sendingCookieToken } = require("../services/cookies.service");
const {
  privateSignupService,
  privateLoginService,
} = require("../services/private.auth.service");
const { createAccessToken, createRefreshToken } = require("../utils/token");

const privateSignupController = async (req, res, next) => {
  try {
    // file from the user
    const { filename } = req.file;
    // credentials from the user
    const { firstName, lastName, email, password, role, code } = req.body;

    const user = await privateSignupService(
      firstName,
      lastName,
      email,
      password,
      code,
      role,
      filename,
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

const privateLoginController = async (req, res, next) => {
  try {
    // credentials from the user
    const { email, password, code, role } = req.body;

    const user = await privateLoginService(email, password, code, role);

    // creating tokens with the user id
    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    // sending tokens to the user
    return sendingCookieToken(res, accessToken, refreshToken);
  } catch (error) {
    return next(error);
  }
};

module.exports = { privateSignupController, privateLoginController };
