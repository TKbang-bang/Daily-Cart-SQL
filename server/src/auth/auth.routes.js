import { Router } from "express";
import { privateSignupController } from "./private.auth.controller.js";
import { profileUpload } from "../utils/multer.js";
import { signupValidation } from "./auth.validation.js";
import {
  logoutController,
  sessionCheckController,
} from "./common.auth.controller.js";

const authRoutes = Router();

authRoutes.post(
  "/private/signup",
  profileUpload().single("image"),
  signupValidation,
  privateSignupController,
);

authRoutes.get("/check", sessionCheckController);
authRoutes.delete("/logout", logoutController);

export default authRoutes;
