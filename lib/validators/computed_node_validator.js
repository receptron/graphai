"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computedNodeValidator = void 0;
const computedNodeValidator = (nodeData) => {
    ["value", "update"].forEach((key) => {
        if (key in nodeData) {
            throw new Error("Computed node does not allow " + key);
        }
    });
};
exports.computedNodeValidator = computedNodeValidator;
