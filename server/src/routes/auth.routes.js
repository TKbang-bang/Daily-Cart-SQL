const {
  commonSignupController,
  commonLoginController,
} = require("../controllers/common.auth.controller");
const { profileUpload } = require("../utils/multer");
const { signupValidation } = require("../middlewares/validations/auth");
const {
  privateSignupController,
  privateLoginController,
} = require("../controllers/private.auth.controller");

const authRoutes = require("express").Router();

// private
authRoutes.post(
  "/private/signup",
  profileUpload().single("image"),
  signupValidation,
  privateSignupController,
);
authRoutes.post("/private/login", privateLoginController);

// common
authRoutes.post("/signup", signupValidation, commonSignupController);
authRoutes.post("/login", commonLoginController);

module.exports = authRoutes;
