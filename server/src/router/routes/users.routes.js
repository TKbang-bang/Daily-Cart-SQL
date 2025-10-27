const {
  getMe,
  getManagers,
  getLogs,
} = require("../../controllers/users.controller");

const usersRoutes = require("express").Router();

// getting current user
usersRoutes.get("/me", getMe);
// getting managers
usersRoutes.get("/managers", getManagers);
// getting logs
usersRoutes.get("/logs", getLogs);

module.exports = usersRoutes;
