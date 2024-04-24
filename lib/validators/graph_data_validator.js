"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphDataValidator = exports.graphNodesValidator = void 0;
const common_1 = require("../validators/common");
const graphNodesValidator = (data) => {
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
    Object.keys(data).forEach((key) => {
        if (!common_1.graphDataAttributeKeys.includes(key)) {
            throw new Error("Graph Data does not allow " + key);
        }
    });
};
exports.graphNodesValidator = graphNodesValidator;
const graphDataValidator = (data) => {
    if (data.loop) {
        if (data.loop.count === undefined && data.loop.while === undefined) {
            throw new Error("Either count or while is required in loop");
        }
        if (data.loop.count !== undefined && data.loop.while !== undefined) {
            throw new Error("Both A and B cannot be set");
        }
    }
};
exports.graphDataValidator = graphDataValidator;
