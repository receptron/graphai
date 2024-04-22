"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nestedAgent = void 0;
const graphai_1 = require("../graphai");
const nestedAgent = async ({ params, inputs, agents, log }) => {
    const graph = new graphai_1.GraphAI(params.graph, agents || {});
    try {
        // Inject inputs to specified source nodes
        (params.injectionTo ?? []).forEach((injectToNodeId, index) => {
            graph.injectValue(injectToNodeId, inputs[index]);
        });
        const results = await graph.run();
        log?.push(...graph.transactionLogs());
        return results[params.resultFrom];
    }
    catch (error) {
        log?.push(...graph.transactionLogs());
        if (error instanceof Error) {
            console.log("Error:", error.message);
        }
        throw error;
    }
};
exports.nestedAgent = nestedAgent;
