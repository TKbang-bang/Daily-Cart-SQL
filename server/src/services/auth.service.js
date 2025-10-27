const { User } = require("../../models");

const signingUp = async (
  firstName,
  lastName,
  email,
  password,
  code,
  filename
) => {
  try {
    let role;

    // check if code is valid / if valid set role
    if (code == `${process.env.ADMIN_CODE}`) role = "admin";
    if (code == `${process.env.MANAGER_CODE}`) role = "moderator";
    if (
      code != `${process.env.ADMIN_CODE}` &&
      code != `${process.env.MANAGER_CODE}`
    )
      return { ok: false, message: "code is not valid", status: 400 };

    // creating user
    const user = await User.create({
      firstname: firstName,
      lastname: lastName,
      email,
      password,
      role,
      profile: filename,
    });

    return { ok: true, id: user.id };
  } catch (error) {
    throw error;
  }
};

const commonSigningUp = async (firstname, lastname, email, password) => {
  try {
    // creating user
    const user = await User.create({ firstname, lastname, email, password });

    return user.id;
  } catch (error) {
    throw error;
  }
};

module.exports = { signingUp, commonSigningUp };
