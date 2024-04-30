"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTestAgents = void 0;
const experimental_agents_1 = require("../experimental_agents");
exports.defaultTestAgents = {
    bypassAgent: experimental_agents_1.bypassAgent,
    echoAgent: experimental_agents_1.echoAgent,
    copyMessageAgent: experimental_agents_1.copyMessageAgent,
    mergeNodeIdAgent: experimental_agents_1.mergeNodeIdAgent,
    sleeperAgent: experimental_agents_1.sleeperAgent,
    sleeperAgentDebug: experimental_agents_1.sleeperAgentDebug,
    stringTemplateAgent: experimental_agents_1.stringTemplateAgent,
    nestedAgent: experimental_agents_1.nestedAgent,
    mapAgent: experimental_agents_1.mapAgent,
    totalAgent: experimental_agents_1.totalAgent,
    countingAgent: experimental_agents_1.countingAgent,
    copy2ArrayAgent: experimental_agents_1.copy2ArrayAgent,
    pushAgent: experimental_agents_1.pushAgent,
    popAgent: experimental_agents_1.popAgent,
    shiftAgent: experimental_agents_1.shiftAgent,
};
