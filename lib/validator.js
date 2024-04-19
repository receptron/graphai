"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGraphData = void 0;
const validateGraphData = (data) => {
    if (data.nodes === undefined) {
        throw new Error("Invalid Graph Data: no nodes");
    }
    return true;
};
exports.validateGraphData = validateGraphData;
