"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentValidator = void 0;
const common_1 = require("./common");
const agentValidator = (graphAgentIds, agentIds) => {
    graphAgentIds.forEach((agentId) => {
        // agentId or dynamic agentId
        if (!agentIds.has(agentId) && agentId[0] !== ":") {
            throw new common_1.ValidationError("Invalid Agent : " + agentId + " is not in AgentFunctionInfoDictionary.");
        }
    });
    return true;
};
exports.agentValidator = agentValidator;
