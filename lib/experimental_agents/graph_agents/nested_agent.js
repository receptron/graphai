"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nestedAgent = exports.getNestedGraphData = void 0;
const graphai_1 = require("../../graphai");
const utils_1 = require("../../utils/utils");
// This function allows us to use one of inputs as the graph data for this nested agent,
// which is equivalent to "eval" of JavaScript.
const getNestedGraphData = (graphData, inputs) => {
    (0, utils_1.assert)(graphData !== undefined, "nestedAgent: graphData is required");
    if (typeof graphData === "string") {
        const regex = /^\$(\d+)$/;
        const match = graphData.match(regex);
        if (match) {
            const index = parseInt(match[1], 10);
            if (index < inputs.length) {
                return inputs[index];
            }
        }
        (0, utils_1.assert)(false, `getNestedGraphData: Invalid graphData string: ${graphData}`);
    }
    return graphData;
};
exports.getNestedGraphData = getNestedGraphData;
const nestedAgent = async ({ params, inputs, agents, log, taskManager, graphData }) => {
    if (taskManager) {
        const status = taskManager.getStatus(false);
        (0, utils_1.assert)(status.concurrency > status.running, `nestedAgent: Concurrency is too low: ${status.concurrency}`);
    }
    const nestedGraphData = (0, exports.getNestedGraphData)(graphData, inputs);
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
    const graphAI = new graphai_1.GraphAI(nestedGraphData, agents || {}, { taskManager });
    // Inject inputs to specified source nodes
    injectionTo.forEach((injectToNodeId, index) => {
        graphAI.injectValue(injectToNodeId, inputs[index]);
    });
    const results = await graphAI.run(false);
    log?.push(...graphAI.transactionLogs());
    return results;
};
exports.nestedAgent = nestedAgent;
const nestedAgentInfo = {
    name: "nestedAgent",
    agent: exports.nestedAgent,
    mock: exports.nestedAgent,
    samples: [],
    description: "nested Agent",
    category: [],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = nestedAgentInfo;
