"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeValidator = void 0;
const common_1 = require("./common");
const nodeValidator = (nodeData) => {
    if (nodeData.agent && nodeData.value) {
        throw new common_1.ValidationError("Cannot set both agent and value");
    }
    // if (!("agent" in nodeData) && !("value" in nodeData)) {
    //   throw new ValidationError("Either agent or value is required");
    // }
    return true;
};
exports.nodeValidator = nodeValidator;
