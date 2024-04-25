"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapAgent = void 0;
const graphai_1 = require("../graphai");
const utils_1 = require("../utils/utils");
const mapAgent = async ({ params, inputs, agents, log, taskManager, graphData }) => {
    if (taskManager) {
        const status = taskManager.getStatus();
        (0, utils_1.assert)(status.concurrency > status.running, `mapAgent: Concurrency is too low: ${status.concurrency}`);
    }
    (0, utils_1.assert)(graphData !== undefined, "mapAgent: graphData is required");
    const input = inputs[0];
    const graphs = input.map((data) => {
        const graphAI = new graphai_1.GraphAI(graphData, agents || {}, taskManager);
        if (params.injectionTo) {
            graphAI.injectValue(params.injectionTo, data);
        }
        return graphAI;
    });
    const runs = graphs.map((graph) => {
        return graph.run();
    });
    const results = await Promise.all(runs);
    const contents = results.map((result) => {
        return result[params.resultFrom];
    });
    if (log) {
        const logs = graphs.map((graph) => {
            return graph.transactionLogs();
        });
        log.push(...logs.flat());
    }
    return { contents };
};
exports.mapAgent = mapAgent;
