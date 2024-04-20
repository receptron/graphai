"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computedNodeValidator = void 0;
const common_1 = require("@/validators/common");
const computedNodeValidator = (nodeData) => {
    Object.keys(nodeData).forEach((key) => {
        if (![...common_1.computedNodeAttributeKeys, "dummy"].includes(key)) {
            throw new Error("Computed node does not allow " + key);
        }
    });
};
exports.computedNodeValidator = computedNodeValidator;
