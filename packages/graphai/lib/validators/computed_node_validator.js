"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computedNodeValidator = void 0;
const common_1 = require("./common");
const computedNodeValidator = (nodeData) => {
    Object.keys(nodeData).forEach((key) => {
        if (!common_1.computedNodeAttributeKeys.includes(key)) {
            throw new common_1.ValidationError("Computed node does not allow " + key);
        }
    });
    if (nodeData.label !== undefined && typeof nodeData.label !== "string") {
        throw new common_1.ValidationError("Computed node label must be a string");
    }
    return true;
};
exports.computedNodeValidator = computedNodeValidator;
