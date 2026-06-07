import { privateSignupService } from "./private.auth.service.js";
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

    console.log({ user });

    // creating tokens
    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    return sendingCookies(res, accessToken, refreshToken, "Signup successful");
  } catch (error) {
    return next(error);
  }
};
