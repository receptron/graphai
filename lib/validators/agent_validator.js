"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentValidator = void 0;
const agentValidator = (graphAgentIds, agentIds) => {
    graphAgentIds.forEach((agentId) => {
        if (!agentIds.has(agentId)) {
            throw new Error("Invalid Agent : " + agentId + " is not in callbackDictonary.");
        }
    });
    return true;
};
exports.agentValidator = agentValidator;
