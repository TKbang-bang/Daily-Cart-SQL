import { Router } from "express";
import authRoutes from "./auth/auth.routes.js";
import protectedRoutes from "./protected.routes.js";
import sessionMiddleware from "./middlewares/session.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/protected", sessionMiddleware, protectedRoutes);

export default router;
