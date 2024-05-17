"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerAgent = void 0;
const nested_agent_1 = require("./nested_agent");
const worker_threads_1 = require("worker_threads");
if (!worker_threads_1.isMainThread && worker_threads_1.parentPort) {
    const port = worker_threads_1.parentPort;
    port.on("message", async (data) => {
        const { graphData, agents } = data;
        /*
        const graphAI = new GraphAI(graphData, agents);
        const result = await graphAI.run();
        */
        port.postMessage({ hello: "foo" });
    });
}
const workerAgent = async ({ inputs, agents, log, graphData }) => {
    const nestedGraphData = (0, nested_agent_1.getNestedGraphData)(graphData, inputs ?? []);
    return new Promise((resolve, reject) => {
        const worker = new worker_threads_1.Worker("./lib/experimental_agents/graph_agents/worker_agent.js");
        worker.on("message", resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
        // copyAgent is required for test case
        worker.postMessage({ graphData: {} /* nestedGraphData */, agent: { /* copyAgent, ...agents */} });
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
            graph: {
                nodes: {
                    source: {
                        value: "May the force be with you"
                    },
                    message: {
                        agent: "copyAgent",
                        inputs: [":source"],
                        isResult: true
                    }
                }
            }
        }],
    description: "Map Agent",
    category: ["graph"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = workerAgentInfo;
