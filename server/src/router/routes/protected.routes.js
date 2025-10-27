const cartRoutes = require("./cart.routes");
const ordersRoutes = require("./orders.routes");
const paymentRoutes = require("./payment.routes");
const productsRoutes = require("./products.routes");
const sessionRoutes = require("./session.routes");
const usersRoutes = require("./users.routes");

const protectedRoutes = require("express").Router();

// checking session
protectedRoutes.use("/session", sessionRoutes);
// users routes
protectedRoutes.use("/users", usersRoutes);
// products routes
protectedRoutes.use("/products", productsRoutes);
// cart routes
protectedRoutes.use("/cart", cartRoutes);
// payment management
protectedRoutes.use("/payment", paymentRoutes);
// orders routes
protectedRoutes.use("/orders/private", ordersRoutes);

module.exports = protectedRoutes;
