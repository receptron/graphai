"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGraphData = void 0;
const validateNodes = (data) => {
    if (data.nodes === undefined) {
        throw new Error("Invalid Graph Data: no nodes");
    }
    if (typeof data.nodes !== "object") {
        throw new Error("Invalid Graph Data: invalid nodes");
    }
    if (Array.isArray(data.nodes)) {
        throw new Error("Invalid Graph Data: nodes must be object");
    }
    if (Object.keys(data.nodes).length === 0) {
        throw new Error("Invalid Graph Data: nodes is empty");
    }
};
const staticNodeValidator = (nodeData) => {
    ["inputs", "anyInput", "params", "retry", "timeout", "fork", "agentId"].forEach((key) => {
        if (key in nodeData) {
            throw new Error("Static node does not allow " + key);
        }
    });
};
const computedNodeValidator = (nodeData) => {
    ["value", "update"].forEach((key) => {
        if (key in nodeData) {
            throw new Error("Computed node does not allow " + key);
        }
    });
};
const validateGraphData = (data) => {
    validateNodes(data);
    Object.keys(data.nodes).forEach((nodeId) => {
        const node = data.nodes[nodeId];
        const isStaticNode = (node.agentId ?? data.agentId) === undefined;
        isStaticNode && staticNodeValidator(node);
        !isStaticNode && computedNodeValidator(node);
        // console.log(node);
    });
    return true;
};
exports.validateGraphData = validateGraphData;
