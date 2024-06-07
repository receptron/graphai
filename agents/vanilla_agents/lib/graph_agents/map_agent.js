"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapAgent = void 0;
const graphai_1 = require("graphai");
const utils_1 = require("graphai/lib/utils/utils");
const nested_agent_1 = require("./nested_agent");
const mapAgent = async ({ params, inputs, agents, log, taskManager, graphData, agentFilters, debugInfo }) => {
    if (taskManager) {
        const status = taskManager.getStatus();
        (0, utils_1.assert)(status.concurrency > status.running, `mapAgent: Concurrency is too low: ${status.concurrency}`);
    }
    const nestedGraphData = (0, nested_agent_1.getNestedGraphData)(graphData, inputs);
    const input = (Array.isArray(inputs[0]) ? inputs[0] : inputs).map((item) => item);
    if (params.limit && params.limit < input.length) {
        input.length = params.limit; // trim
    }
    const namedInputs = params.namedInputs ??
        inputs.map((__input, index) => {
            return `$${index}`;
        });
    namedInputs.forEach((nodeId) => {
        if (nestedGraphData.nodes[nodeId] === undefined) {
            // If the input node does not exist, automatically create a static node
            nestedGraphData.nodes[nodeId] = { value: {} };
        }
    });
    try {
        if (nestedGraphData.version === undefined && debugInfo.version) {
            nestedGraphData.version = debugInfo.version;
        }
        const graphs = input.map((data) => {
            const graphAI = new graphai_1.GraphAI(nestedGraphData, agents || {}, {
                taskManager,
                agentFilters: agentFilters || [],
            });
            // Only the first input will be mapped
            namedInputs.forEach((injectToNodeId, index) => {
                graphAI.injectValue(injectToNodeId, index === 0 ? data : inputs[index], "__mapAgent_inputs__");
            });
            return graphAI;
        });
        const runs = graphs.map((graph) => {
            return graph.run(false);
        });
        const results = await Promise.all(runs);
        const nodeIds = Object.keys(results[0]);
        // assert(nodeIds.length > 0, "mapAgent: no return values (missing isResult)");
        const compositeResult = nodeIds.reduce((tmp, nodeId) => {
            tmp[nodeId] = results.map((result) => {
                return result[nodeId];
            });
            return tmp;
        }, {});
        if (log) {
            const logs = graphs.map((graph, index) => {
                return graph.transactionLogs().map((log) => {
                    log.mapIndex = index;
                    return log;
                });
            });
            log.push(...logs.flat());
        }
        return compositeResult;
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
exports.mapAgent = mapAgent;
const mapAgentInfo = {
    name: "mapAgent",
    agent: exports.mapAgent,
    mock: exports.mapAgent,
    samples: [],
    description: "Map Agent",
    category: ["graph"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = mapAgentInfo;
