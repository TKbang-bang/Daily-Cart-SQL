import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import router from "./router.js";
import errorHandler from "./errors/error.handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// creating express app
const app = express();

// setters
app.set("port", process.env.PORT || 4000);

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    exposedHeaders: ["access-token"],
  }),
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

// routes
app.use(router);

// errors
app.use(errorHandler);

export default app;
