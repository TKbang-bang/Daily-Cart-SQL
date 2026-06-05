const { sessionCheck, logout } = require("../controllers/session.controller");

const sessionRoutes = require("express").Router();

// session check
sessionRoutes.get("/check", sessionCheck);
// logout
sessionRoutes.get("/logout", logout);

module.exports = sessionRoutes;
