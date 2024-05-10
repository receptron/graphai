"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeValidator = void 0;
const nodeValidator = (nodeData) => {
    if (nodeData.agent && nodeData.value) {
        throw new Error("Cannot set both agent and value");
    }
    if (!("agent" in nodeData) && !("value" in nodeData)) {
        throw new Error("Either agent or value is required");
    }
    return true;
};
exports.nodeValidator = nodeValidator;
