import { Router } from "express";
import usersRoutes from "./users/users.routes.js";

const protectedRoutes = Router();

protectedRoutes.use("/users", usersRoutes);

export default protectedRoutes;
