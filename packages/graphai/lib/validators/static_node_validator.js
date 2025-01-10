"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticNodeValidator = void 0;
const common_1 = require("./common");
const staticNodeValidator = (nodeData) => {
    Object.keys(nodeData).forEach((key) => {
        if (!common_1.staticNodeAttributeKeys.includes(key)) {
            throw new common_1.ValidationError("Static node does not allow " + key);
        }
    });
    return true;
};
exports.staticNodeValidator = staticNodeValidator;
