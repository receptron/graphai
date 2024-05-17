"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerAgent = void 0;
const utils_1 = require("../../utils/utils");
const worker_threads_1 = require("worker_threads");
const workerAgent = async ({ inputs, agents, log, graphData }) => {
    const worker = new worker_threads_1.Worker("./worker.js");
    worker.postMessage(["hello"]);
    console.log("sleeping...");
    await (0, utils_1.sleep)(5000);
    console.log("terminating...");
    worker.terminate();
    return { message: "Hello World" };
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
