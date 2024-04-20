"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphNodesValidate = void 0;
const common_1 = require("../validators/common");
const graphNodesValidate = (data) => {
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
        if (![...common_1.graphDataAttributeKeys, "dummy"].includes(key)) {
            throw new Error("Graph Data does not allow " + key);
        }
    });
};
exports.graphNodesValidate = graphNodesValidate;
