import { sendingCookies } from "../utils/cookies.js";
import { createAccessToken, createRefreshToken } from "../utils/tokens.js";
import {
  commonSigninService,
  commonSignupService,
} from "./common.auth.service.js";

export const commonSignupController = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    const user = await commonSignupService(
      firstname,
      lastname,
      email,
      password,
    );

    // creating tokens
    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    return sendingCookies(res, accessToken, refreshToken, "Signup successful");
  } catch (error) {
    return next(error);
  }
};

export const commonSigninController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await commonSigninService(email, password);

    // creating tokens
    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    return sendingCookies(res, accessToken, refreshToken, "Signin successful");
  } catch (error) {
    return next(error);
  }
};

export const sessionCheckController = (req, res, next) => {
  try {
    return res.status(200).json({ message: "Be a good user" });
  } catch (error) {
    return next(error);
  }
};

export const logoutController = (req, res, next) => {
  req.userId = null;

  // clearing cookies
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  return res.status(204).end();
};
