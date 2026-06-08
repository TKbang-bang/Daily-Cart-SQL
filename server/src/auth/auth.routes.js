import { Router } from "express";
import {
  privateSigninController,
  privateSignupController,
} from "./private.auth.controller.js";
import { profileUpload } from "../utils/multer.js";
import { signupValidation } from "./auth.validation.js";
import {
  commonSigninController,
  commonSignupController,
  logoutController,
  sessionCheckController,
} from "./common.auth.controller.js";
import sessionMiddleware from "../middlewares/session.js";

const authRoutes = Router();

authRoutes.post(
  "/private/signup",
  profileUpload().single("image"),
  signupValidation,
  privateSignupController,
);
authRoutes.post("/private/signin", privateSigninController);

// common
authRoutes.get("/check", sessionMiddleware, sessionCheckController);
authRoutes.delete("/logout", logoutController);

authRoutes.post("/signup", signupValidation, commonSignupController);
authRoutes.post("/signin", commonSigninController);

export default authRoutes;
