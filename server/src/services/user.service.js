const { User, Log } = require("../../models");

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    return await User.findByPk(id);
  } catch (error) {
    throw error;
  }
};

const gettingUsers = async () => {
  try {
    return await User.findAll({
      where: {
        role: "moderator",
      },
    });
  } catch (error) {
    throw error;
  }
};

const gettingLogs = async () => {
  try {
    return await Log.findAll();
  } catch (error) {
    throw error;
  }
};

module.exports = { getUserByEmail, getUserById, gettingUsers, gettingLogs };
