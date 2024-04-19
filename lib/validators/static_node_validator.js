"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticNodeValidator = void 0;
const staticNodeValidator = (nodeData) => {
    ["inputs", "anyInput", "params", "retry", "timeout", "fork", "agentId"].forEach((key) => {
        if (key in nodeData) {
            throw new Error("Static node does not allow " + key);
        }
    });
};
exports.staticNodeValidator = staticNodeValidator;
