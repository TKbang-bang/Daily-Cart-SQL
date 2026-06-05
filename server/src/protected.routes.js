const cartRoutes = require("./routes/cart.routes");
const ordersRoutes = require("./routes/orders.routes");
const paymentRoutes = require("./routes/payment.routes");
const productsRoutes = require("./routes/products.routes");
const usersRoutes = require("./routes/users.routes");
const sessionRoutes = require("./routes/session.routes");

const protectedRoutes = require("express").Router();

// checking session
protectedRoutes.use("/session", sessionRoutes);
// // users routes
protectedRoutes.use("/users", usersRoutes);
// // products routes
protectedRoutes.use("/products", productsRoutes);
// // cart routes
protectedRoutes.use("/cart", cartRoutes);
// // payment management
protectedRoutes.use("/payment", paymentRoutes);
// // orders routes
protectedRoutes.use("/orders/private", ordersRoutes);

module.exports = protectedRoutes;
