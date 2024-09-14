"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nestedAgent = void 0;
const graphai_1 = require("graphai");
const nestedAgent = async ({ namedInputs, agents, log, taskManager, graphData, agentFilters, debugInfo, config }) => {
    if (taskManager) {
        const status = taskManager.getStatus(false);
        (0, graphai_1.assert)(status.concurrency > status.running, `nestedAgent: Concurrency is too low: ${status.concurrency}`);
    }
    (0, graphai_1.assert)(!!graphData, "nestedAgent: graph is required");
    const { nodes } = graphData;
    const nestedGraphData = { ...graphData, nodes: { ...nodes }, version: graphai_1.graphDataLatestVersion }; // deep enough copy
    const nodeIds = Object.keys(namedInputs);
    if (nodeIds.length > 0) {
        nodeIds.forEach((nodeId) => {
            if (nestedGraphData.nodes[nodeId] === undefined) {
                // If the input node does not exist, automatically create a static node
                nestedGraphData.nodes[nodeId] = { value: namedInputs[nodeId] };
            }
            else {
                // Otherwise, inject the proper data here (instead of calling injectTo method later)
                nestedGraphData.nodes[nodeId]["value"] = namedInputs[nodeId];
            }
        });
    }
    try {
        if (nestedGraphData.version === undefined && debugInfo.version) {
            nestedGraphData.version = debugInfo.version;
        }
        const graphAI = new graphai_1.GraphAI(nestedGraphData, agents || {}, {
            taskManager,
            agentFilters,
            config,
        });
        const results = await graphAI.run(false);
        log?.push(...graphAI.transactionLogs());
        return results;
    }
    catch (error) {
        if (error instanceof Error) {
            return {
                onError: {
                    message: error.message,
                    error,
                },
            };
        }
        throw error;
    }
};
exports.nestedAgent = nestedAgent;
const nestedAgentInfo = {
    name: "nestedAgent",
    agent: exports.nestedAgent,
    mock: exports.nestedAgent,
    samples: [
        {
            inputs: {
                message: "hello",
            },
            params: {},
            result: {
                test: ["hello"],
            },
            graph: {
                nodes: {
                    test: {
                        agent: "bypassAgent",
                        inputs: [":message"],
                        isResult: true,
                    },
                },
            },
        },
    ],
    description: "nested Agent",
    category: ["graph"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = nestedAgentInfo;
