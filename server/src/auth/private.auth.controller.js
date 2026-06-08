import {
  privateSigninService,
  privateSignupService,
} from "./private.auth.service.js";
import { createAccessToken, createRefreshToken } from "../utils/tokens.js";
import { sendingCookies } from "../utils/cookies.js";

export const privateSignupController = async (req, res, next) => {
  try {
    const { filename } = req.file;
    const { firstname, lastname, email, password, code, role } = req.body;

    // creating the user
    const user = await privateSignupService(
      firstname,
      lastname,
      email,
      password,
      code,
      role,
      filename,
    );

    // creating tokens
    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    return sendingCookies(res, accessToken, refreshToken, "Signup successful");
  } catch (error) {
    return next(error);
  }
};

export const privateSigninController = async (req, res, next) => {
  try {
    const { email, password, code, role } = req.body;

    const user = await privateSigninService(email, password, code, role);

    // creating tokens
    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    return sendingCookies(res, accessToken, refreshToken, "Signin successful");
  } catch (error) {
    return next(error);
  }
};
