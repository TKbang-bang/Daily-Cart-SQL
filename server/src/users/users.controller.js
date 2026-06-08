import { getMeService } from "./users.service.js";

export const getMeController = async (req, res, next) => {
  try {
    const { userID } = req;

    const user = await getMeService(userID);

    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
};
