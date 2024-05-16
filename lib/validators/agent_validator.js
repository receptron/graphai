"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentValidator = void 0;
const common_1 = require("../validators/common");
const agentValidator = (graphAgentIds, agentIds) => {
    graphAgentIds.forEach((agentId) => {
        if (!agentIds.has(agentId)) {
            throw new common_1.ValidationError("Invalid Agent : " + agentId + " is not in callbackDictonary.");
        }
    });
    return true;
};
exports.agentValidator = agentValidator;
