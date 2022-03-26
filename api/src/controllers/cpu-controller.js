const os = require("os");

const usage = async (_, reply) => {
  try {
    const cpus = os.cpus().length;
    const load = os.loadavg()[0] / cpus;
    const res = { load, date: new Date().getTime() };
    reply.code(200).send(res);
  } catch (err) {
    reply.code(500).send(err);
  }
};

module.exports = {
  usage,
};
