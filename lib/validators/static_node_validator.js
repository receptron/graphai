"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticNodeValidator = void 0;
const staticNodeAttributeKeys = ["inputs", "anyInput", "params", "retry", "timeout", "fork", "agentId"];
const staticNodeValidator = (nodeData) => {
    staticNodeAttributeKeys.forEach((key) => {
        if (key in nodeData) {
            throw new Error("Static node does not allow " + key);
        }
    });
};
exports.staticNodeValidator = staticNodeValidator;
