const bcrypt = require("bcrypt");

const ServerError = require("../Errors/errorClas");
const { User } = require("../../models");

const privateSignupService = async (
  firstName,
  lastName,
  email,
  password,
  code,
  role,
  filename,
) => {
  let userRole;

  if (role != "admin" && role != "moderator")
    throw new ServerError("role is not valid", 400);

  // check if code is valid / if valid set role
  if (role == "admin" && code == `${process.env.ADMIN_CODE}`)
    userRole = "admin";
  if (role == "moderator" && code == `${process.env.MANAGER_CODE}`)
    userRole = "moderator";
  if (userRole != "admin" && userRole != "moderator")
    throw new ServerError("code is not valid", 400);

  // check if the user email is already in use
  const userExists = await User.findOne({ where: { email } });
  if (userExists) throw new ServerError("Email is already in use", 409);

  // creating user
  const user = await User.create({
    firstname: firstName,
    lastname: lastName,
    email,
    password,
    role: userRole,
    profile: filename,
  });

  return user;
};

const privateLoginService = async (email, password, code, role) => {
  // check if the user email exists
  const user = await User.findOne({ where: { email } });
  if (!user) throw new ServerError("Email not found", 404);

  // check if the user password is correct
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new ServerError("Password is incorrect", 401);

  // check if the user role is correct
  if (role != user.role) throw new ServerError("role is incorrect", 400);

  // check if the user code is correct
  if (user.role == "admin" && code != `${process.env.ADMIN_CODE}`)
    throw new ServerError("code is incorrect", 400);
  if (user.role == "moderator" && code != `${process.env.MANAGER_CODE}`)
    throw new ServerError("code is incorrect", 400);

  return user;
};

module.exports = { privateSignupService, privateLoginService };
