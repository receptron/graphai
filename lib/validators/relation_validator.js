"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relationValidator = void 0;
const relationValidator = (data) => {
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
};
exports.relationValidator = relationValidator;
