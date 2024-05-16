"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphDataValidator = exports.graphNodesValidator = void 0;
const common_1 = require("../validators/common");
const graphNodesValidator = (data) => {
    if (data.nodes === undefined) {
        throw new common_1.ValidationError("Invalid Graph Data: no nodes");
    }
    if (typeof data.nodes !== "object") {
        throw new common_1.ValidationError("Invalid Graph Data: invalid nodes");
    }
    if (Array.isArray(data.nodes)) {
        throw new common_1.ValidationError("Invalid Graph Data: nodes must be object");
    }
    if (Object.keys(data.nodes).length === 0) {
        throw new common_1.ValidationError("Invalid Graph Data: nodes is empty");
    }
    Object.keys(data).forEach((key) => {
        if (!common_1.graphDataAttributeKeys.includes(key)) {
            throw new common_1.ValidationError("Graph Data does not allow " + key);
        }
    });
};
exports.graphNodesValidator = graphNodesValidator;
const graphDataValidator = (data) => {
    if (data.loop) {
        if (data.loop.count === undefined && data.loop.while === undefined) {
            throw new common_1.ValidationError("Loop: Either count or while is required in loop");
        }
        if (data.loop.count !== undefined && data.loop.while !== undefined) {
            throw new common_1.ValidationError("Loop: Both count and while cannot be set");
        }
    }
    if (data.concurrency !== undefined) {
        if (!Number.isInteger(data.concurrency)) {
            throw new common_1.ValidationError("Concurrency must be an integer");
        }
        if (data.concurrency < 1) {
            throw new common_1.ValidationError("Concurrency must be a positive integer");
        }
    }
};
exports.graphDataValidator = graphDataValidator;
