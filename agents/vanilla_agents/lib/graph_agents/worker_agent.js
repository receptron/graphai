"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerAgent = void 0;
const graphai_1 = require("graphai");
const worker_threads_1 = require("worker_threads");
const index_1 = require("../index");
const vanillaAgents = {
    totalAgent: index_1.totalAgent,
    dataSumTemplateAgent: index_1.dataSumTemplateAgent,
    propertyFilterAgent: index_1.propertyFilterAgent,
    copyAgent: index_1.copyAgent,
    pushAgent: index_1.pushAgent,
    popAgent: index_1.popAgent,
    shiftAgent: index_1.shiftAgent,
    nestedAgent: index_1.nestedAgent,
    mapAgent: index_1.mapAgent,
    dotProductAgent: index_1.dotProductAgent,
    sortByValuesAgent: index_1.sortByValuesAgent,
    stringSplitterAgent: index_1.stringSplitterAgent,
    stringTemplateAgent: index_1.stringTemplateAgent,
    jsonParserAgent: index_1.jsonParserAgent,
};
if (!worker_threads_1.isMainThread && worker_threads_1.parentPort) {
    const port = worker_threads_1.parentPort;
    port.on("message", async (data) => {
        const { graphData } = data;
        const graphAI = new graphai_1.GraphAI(graphData, vanillaAgents);
        const result = await graphAI.run();
        port.postMessage(result);
    });
}
const workerAgent = async ({ namedInputs, /* agents, log, */ forNestedGraph }) => {
    const { graphData } = forNestedGraph ?? {};
    (0, graphai_1.assert)(!!graphData, "required");
    (0, graphai_1.assert)(typeof graphData === "object", "required");
    const nodeIds = Object.keys(namedInputs);
    if (nodeIds.length > 0) {
        nodeIds.forEach((nodeId) => {
            if (graphData.nodes[nodeId] === undefined) {
                // If the input node does not exist, automatically create a static node
                graphData.nodes[nodeId] = { value: namedInputs[nodeId] };
            }
            else {
                // Otherwise, inject the proper data here (instead of calling injectTo method later)
                graphData.nodes[nodeId]["value"] = namedInputs[nodeId];
            }
        });
    }
    return new Promise((resolve, reject) => {
        const worker = new worker_threads_1.Worker(__dirname + "/worker_agent");
        worker.on("message", (result) => {
            worker.terminate();
            resolve(result);
        });
        worker.on("error", reject);
        worker.on("exit", (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
        // copyAgent is required for test case
        worker.postMessage({ graphData });
    });
};
exports.workerAgent = workerAgent;
const workerAgentInfo = {
    name: "workerAgent",
    agent: exports.workerAgent,
    mock: exports.workerAgent,
    samples: [
        {
            inputs: [],
            params: {},
            result: { message: { text: "May the force be with you" } },
            graph: {
                version: 0.5,
                nodes: {
                    source: {
                        value: "May the force be with you",
                    },
                    message: {
                        agent: "copyAgent",
                        inputs: { text: ":source" },
                        isResult: true,
                    },
                },
            },
        },
        {
            inputs: ["May the force be with you"],
            params: {},
            result: { message: { text: "May the force be with you" } },
            graph: {
                version: 0.5,
                nodes: {
                    source: {
                        value: "TypeScript compiler fails without this node for some reason.",
                    },
                    message: {
                        agent: "copyAgent",
                        inputs: { text: ":$0" },
                        isResult: true,
                    },
                },
            },
        },
    ],
    description: "Map Agent",
    category: ["graph"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = workerAgentInfo;
