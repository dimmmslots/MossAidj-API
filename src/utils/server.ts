const express = require("express");
const poinRoutes = require("../routes/PoinRoute");
const pertemuanRoutes = require("../routes/PertemuanRoute");

function createServer() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/poin", poinRoutes);
  app.use("/pertemuan", pertemuanRoutes);

  return app;
}

export default createServer;
