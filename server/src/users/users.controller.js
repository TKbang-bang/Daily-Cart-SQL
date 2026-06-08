import {
  getLogsService,
  getManagersService,
  getMeService,
} from "./users.service.js";

export const getMeController = async (req, res, next) => {
  try {
    const { userID } = req;

    const user = await getMeService(userID);

    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
};

export const getManagersController = async (req, res, next) => {
  try {
    const { userID } = req;

    const managers = await getManagersService(userID);

    return res.status(200).json({ users: managers });
  } catch (error) {
    return next(error);
  }
};

export const getLogsController = async (req, res, next) => {
  try {
    const { userID } = req;

    const logs = await getLogsService(userID);

    return res.status(200).json({ logs });
  } catch (error) {
    return next(error);
  }
};
