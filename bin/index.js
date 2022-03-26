/**
 * This file contains some scripts which can be used to test the
 * functionality of the application.
 * For example, you can use this file to stress your CPU and watch heavy load alarms running:
 *  > node bin/index.js stress 25
 *
 * It will wun a fibonacci sequence of 25 numbers in parallel for each CPU
 * A calculation around 60 numbers it should be enough to stress the CPU
 * the 2 mins required to fire an alarm
 */
const { Worker } = require("worker_threads");

const os = require("os");
const NUM_WORKERS = os.cpus().length;

const TASKS = {
  stress: stressAllCPUs,
};

const main = async () => {
  const [task, num, ...args] = process.argv.slice(2);

  // Validation of args
  if (!task) {
    console.error("Task is required");
    process.exit(1);
  }

  if (!TASKS[task]) {
    console.error("Task not valid");
    process.exit(1);
  }

  // Running
  console.log("   Task:", task);

  console.log("\n");

  TASKS[task](num);
};

main();

function stressAllCPUs(num = 50) {
  console.log("⚙️  Simulating heavy load \n");
  for (let i = 0; i < NUM_WORKERS; i++) {
    const worker = new Worker("./bin/fibonacci.js", {
      workerData: { num },
    });

    worker.on("message", (msg) => {
      console.log(` > Worker ${i + 1}: ${msg}`);
    });
  }
}
