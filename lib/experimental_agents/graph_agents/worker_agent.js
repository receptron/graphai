"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerAgent = void 0;
const worker_threads_1 = require("worker_threads");
if (!worker_threads_1.isMainThread && worker_threads_1.parentPort) {
    const port = worker_threads_1.parentPort;
    port.on("message", (data) => {
        port.postMessage(data);
    });
}
const workerAgent = async ({ inputs, agents, log, graphData }) => {
    return new Promise((resolve, reject) => {
        const worker = new worker_threads_1.Worker("./lib/experimental_agents/graph_agents/worker_agent.js");
        worker.on("message", resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
        worker.postMessage({ message: "Hello World" });
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
