"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relationValidator = void 0;
const relationValidator = (data) => {
    const nodeIds = Object.keys(data.nodes);
    nodeIds.forEach((nodeId) => {
        const nodeData = data.nodes[nodeId];
        if (nodeData.inputs) {
            nodeData.inputs.forEach((inputNodeId) => {
                if (!nodeIds.includes(inputNodeId)) {
                    throw new Error(`Inputs not match: NodeId ${nodeId}, Inputs: ${inputNodeId}`);
                }
            });
        }
    });
};
exports.relationValidator = relationValidator;
