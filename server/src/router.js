const sessionMiddleware = require("./middlewares/session");
const authRoutes = require("./routes/auth.routes");
const protectedRoutes = require("./protected.routes");

const router = require("express").Router();

// auth routes
router.use("/auth", authRoutes);
// protected routes
router.use("/protected", sessionMiddleware, protectedRoutes);

module.exports = router;
