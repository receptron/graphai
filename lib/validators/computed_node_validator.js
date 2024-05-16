"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computedNodeValidator = void 0;
const common_1 = require("../validators/common");
const computedNodeValidator = (nodeData) => {
    Object.keys(nodeData).forEach((key) => {
        if (!common_1.computedNodeAttributeKeys.includes(key)) {
            throw new common_1.ValidationError("Computed node does not allow " + key);
        }
    });
    return true;
};
exports.computedNodeValidator = computedNodeValidator;
