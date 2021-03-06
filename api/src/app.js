const Fastify = require("fastify");
const { fromEnv } = require("./utils");
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require("./errors");

const logsConfig = {
  formatters: {
    level(level) {
      return { level };
    },
  },
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
  level: fromEnv("LOG_LEVEL"),
};

const logger = {
  development: {
    prettyPrint: {
      colorize: true,
      levelFirst: true,
      ignore: "time,pid,hostname",
    },
    level: fromEnv("LOG_LEVEL"),
  },
  staging: logsConfig,
  production: logsConfig,
};

const build = async () => {
  const fastify = Fastify({
    bodyLimit: 1048576 * 2,
    logger: logger[fromEnv("NODE_ENV")],
  });

  await fastify.register(require("fastify-cors"), { origin: "*" });
  await fastify.register(require("fastify-helmet"), {
    contentSecurityPolicy: {
      directives: {
        baseUri: ["'self'"],
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'self'"],
        workerSrc: ["'self'", "blob:"],
        frameSrc: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
  });
  await fastify.register(require("./routes/api"), { prefix: "api/v1" });

  fastify.setNotFoundHandler((request, reply) => {
    fastify.log.debug(`Route not found: ${request.method}:${request.raw.url}`);

    reply.status(404).send({
      statusCode: 404,
      error: NOT_FOUND,
      message: `Route ${request.method}:${request.raw.url} not found`,
    });
  });

  fastify.setErrorHandler((err, request, reply) => {
    fastify.log.debug(`Request url: ${request.raw.url}`);
    fastify.log.debug(`Payload: ${request.body}`);
    fastify.log.error(`Error occurred: ${err}`);

    const code = err.statusCode ?? 500;

    reply.status(code).send({
      statusCode: code,
      error: err.name ?? INTERNAL_SERVER_ERROR,
      message: err.message ?? err,
    });
  });

  return fastify;
};

// implement inversion of control to make the code testable
module.exports = {
  build,
};
