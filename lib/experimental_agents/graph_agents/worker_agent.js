"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerAgent = void 0;
const worker_threads_1 = require("worker_threads");
if (!worker_threads_1.isMainThread && worker_threads_1.parentPort) {
    worker_threads_1.parentPort.postMessage({ message: "Hello World" });
}
const workerAgent = async ({ inputs, agents, log, graphData }) => {
    return new Promise((resolve, reject) => {
        const myWorker = new worker_threads_1.Worker("./lib/experimental_agents/graph_agents/worker_agent.js");
        myWorker.on("message", resolve);
        myWorker.on('error', reject);
        myWorker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
        // myWorker.postMessage(["hello"]);
    });
};
exports.workerAgent = workerAgent;
const workerAgentInfo = {
    name: "workerAgent",
    agent: exports.workerAgent,
    mock: exports.workerAgent,
    samples: [{
            inputs: ["foo"],
            params: {},
            result: { message: "Hello World" },
        }],
    description: "Map Agent",
    category: ["graph"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = workerAgentInfo;
