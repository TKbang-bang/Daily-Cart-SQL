const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./Errors/errorHandler");
const path = require("path");
const router = require("./router");

// creating express app
const app = express();

// setters
app.set("port", process.env.PORT || 3000);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [`${process.env.CLIENT_URL}`, `${process.env.ADMIN_URL}`],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    exposedHeaders: ["access-token"],
  }),
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

// routes
app.use(router);

// error handler
app.use(errorHandler);

module.exports = app;
