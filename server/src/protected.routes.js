import { Router } from "express";
import usersRoutes from "./users/users.routes.js";
import productsRoutes from "./products/products.routes.js";

const protectedRoutes = Router();

protectedRoutes.use("/users", usersRoutes);
protectedRoutes.use("/products", productsRoutes);

export default protectedRoutes;
