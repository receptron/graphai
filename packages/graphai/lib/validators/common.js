"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.staticNodeAttributeKeys = exports.computedNodeAttributeKeys = exports.graphDataAttributeKeys = void 0;
exports.graphDataAttributeKeys = ["nodes", "concurrency", "agentId", "loop", "verbose", "version"];
exports.computedNodeAttributeKeys = [
    "inputs",
    "output",
    "anyInput",
    "params",
    "retry",
    "timeout",
    "agent",
    "graph",
    "graphLoader",
    "isResult",
    "priority",
    "if",
    "unless",
    "defaultValue",
    "filterParams",
    "console",
    "passThrough",
];
exports.staticNodeAttributeKeys = ["value", "update", "isResult", "console"];
class ValidationError extends Error {
    constructor(message) {
        super(`\x1b[41m${message}\x1b[0m`); // Pass the message to the base Error class
        // Set the prototype explicitly to ensure correct prototype chain
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
exports.ValidationError = ValidationError;
