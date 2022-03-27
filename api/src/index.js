const { build } = require("./app");
const { fromEnv, terminate } = require("./utils");

// I have to be honest here. It's the first time I use fastify
// and I'm not very familiar with it. I just copied a random scaffold from github
build()
  .then((app) => {
    app
      .listen(fromEnv("APP_PORT"), "0.0.0.0")
      .then((_) => {
        const exitHandler = terminate(app, {
          coredump: false,
          timeout: 500,
        });

        process.on("uncaughtException", exitHandler(1, "Unexpected Error"));
        process.on("unhandledRejection", exitHandler(1, "Unhandled Promise"));
        process.on("SIGTERM", exitHandler(0, "SIGTERM"));
        process.on("SIGINT", exitHandler(0, "SIGINT"));
      })
      .catch((err) => {
        console.log("Error starting server: ", err);
        process.exit(1);
      });
  })
  .catch((err) => console.log(err));
