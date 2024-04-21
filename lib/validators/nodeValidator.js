"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeValidator = void 0;
const nodeValidator = (nodeData) => {
    if (nodeData.agentId && nodeData.value) {
        throw new Error("Cannot set both agentId and value");
    }
    if (!("agentId" in nodeData) && !("value" in nodeData)) {
        throw new Error("Either agentId or value is required");
    }
    return true;
};
exports.nodeValidator = nodeValidator;
