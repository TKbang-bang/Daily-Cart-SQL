const bcrypt = require("bcrypt");
const { User } = require("../../models");
const ServerError = require("../Errors/errorClas");

const commonSignUpService = async (firstname, lastname, email, password) => {
  // check if the user email is already in use
  const userExists = await User.findOne({ where: { email } });
  if (userExists) throw new ServerError("Email is already in use", 409);

  // creating user
  const user = await User.create({ firstname, lastname, email, password });

  return user;
};

const commonLoginService = async (email, password) => {
  // check if the user email exists
  const user = await User.findOne({ where: { email } });
  if (!user) throw new ServerError("Email not found", 404);

  // check if the user password is correct
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new ServerError("Password is incorrect", 401);

  return user;
};

module.exports = { commonSignUpService, commonLoginService };
