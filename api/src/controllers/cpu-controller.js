const os = require("os");

// I had doubs about if it had more sense get the date in server or in client.
// In this case there's not too much difference. But taking in account we are measuring
// the performance of the server cpu, I guess it has more sense to get the date in server.
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
