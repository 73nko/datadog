const { cpuControllers } = require("../../controllers");

const cpuRoutes = async (app, options) => {
  app.get("/usage", {}, cpuControllers.usage);
};

module.exports = cpuRoutes;
