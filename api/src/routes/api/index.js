const apiRoutes = async (app, options) => {
  app.register(require("./cpu"), { prefix: "cpu" });
  app.get("/", async (request, reply) => {
    return {
      message: "Api is running",
    };
  });
};

module.exports = apiRoutes;
