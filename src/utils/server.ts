const express = require("express");
const poinRoutes = require("../routes/PoinRoute");
const pertemuanRoutes = require("../routes/PertemuanRoute");
const authRoutes = require("../routes/AuthRoute");
const cookieParser = require("cookie-parser");
const jwtValidation = require("../middlewares/jwtValidation");

function createServer() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use("/poin", jwtValidation, poinRoutes);
  app.use("/pertemuan", jwtValidation, pertemuanRoutes);
  app.use("/auth", authRoutes);

  return app;
}

export default createServer;
