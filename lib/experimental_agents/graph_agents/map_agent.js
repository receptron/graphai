"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapAgent = void 0;
const graphai_1 = require("../../graphai");
const utils_1 = require("../../utils/utils");
const nested_agent_1 = require("./nested_agent");
const mapAgent = async ({ params, inputs, agents, log, taskManager, graphData }) => {
    if (taskManager) {
        const status = taskManager.getStatus();
        (0, utils_1.assert)(status.concurrency > status.running, `mapAgent: Concurrency is too low: ${status.concurrency}`);
    }
    const nestedGraphData = (0, nested_agent_1.getNestedGraphData)(graphData, inputs);
    const input = Array.isArray(inputs[0]) ? inputs[0] : inputs;
    const injectionTo = params.injectionTo ??
        inputs.map((__input, index) => {
            return `$${index}`;
        });
    injectionTo.forEach((nodeId) => {
        if (nestedGraphData.nodes[nodeId] === undefined) {
            // If the input node does not exist, automatically create a static node
            nestedGraphData.nodes[nodeId] = { value: {} };
        }
    });
    const graphs = input.map((data) => {
        const graphAI = new graphai_1.GraphAI(nestedGraphData, agents || {}, taskManager);
        // Only the first input will be mapped
        injectionTo.forEach((injectToNodeId, index) => {
            graphAI.injectValue(injectToNodeId, index === 0 ? data : inputs[index], "__mapAgent_inputs__");
        });
        return graphAI;
    });
    const runs = graphs.map((graph) => {
        return graph.run(false);
    });
    const results = await Promise.all(runs);
    const nodeIds = Object.keys(results[0]);
    (0, utils_1.assert)(nodeIds.length > 0, "mapAgent: no return values (missing isResult)");
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
};
exports.mapAgent = mapAgent;
const mapAgentInfo = {
    name: "mapAgent",
    agent: exports.mapAgent,
    mock: exports.mapAgent,
    samples: [],
    description: "Map Agent",
    category: [],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = mapAgentInfo;
