import { Router } from "express";
import usersRoutes from "./users/users.routes.js";
import productsRoutes from "./products/products.routes.js";
import cartRoutes from "./cart/cart.routes.js";
import ordersRoutes from "./orders/orders.routes.js";
import paymentsRoutes from "./payments/payments.routes.js";

const protectedRoutes = Router();

protectedRoutes.use("/users", usersRoutes);
protectedRoutes.use("/products", productsRoutes);
protectedRoutes.use("/cart", cartRoutes);
protectedRoutes.use("/orders", ordersRoutes);
protectedRoutes.use("/payment", paymentsRoutes);

export default protectedRoutes;
