"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relationValidator = void 0;
const relationValidator = (data, computedNodeIds) => {
    const nodeIds = Object.keys(data.nodes);
    nodeIds.forEach((nodeId) => {
        const nodeData = data.nodes[nodeId];
        if (nodeData.inputs) {
            nodeData.inputs.forEach((inputNodeId) => {
                const input = inputNodeId.split(".")[0];
                if (!nodeIds.includes(input)) {
                    throw new Error(`Inputs not match: NodeId ${nodeId}, Inputs: ${input}`);
                }
            });
        }
    });
    // initial running node
    const haveRunningNodes = computedNodeIds.reduce((tmp, nodeId) => {
        const nodeData = data.nodes[nodeId];
        return tmp || nodeData.inputs === undefined || nodeData.inputs.length === 0;
    }, false);
    if (!haveRunningNodes) {
        throw new Error("No Initial Runnning Node");
    }
};
exports.relationValidator = relationValidator;
