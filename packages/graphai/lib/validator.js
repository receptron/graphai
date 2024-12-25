"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAgent = exports.validateGraphData = void 0;
const graph_data_validator_1 = require("./validators/graph_data_validator");
const nodeValidator_1 = require("./validators/nodeValidator");
const static_node_validator_1 = require("./validators/static_node_validator");
const computed_node_validator_1 = require("./validators/computed_node_validator");
const relation_validator_1 = require("./validators/relation_validator");
const agent_validator_1 = require("./validators/agent_validator");
const common_1 = require("./validators/common");
const validateGraphData = (data, agentIds) => {
    (0, graph_data_validator_1.graphNodesValidator)(data);
    (0, graph_data_validator_1.graphDataValidator)(data);
    const computedNodeIds = [];
    const staticNodeIds = [];
    const graphAgentIds = new Set();
    Object.keys(data.nodes).forEach((nodeId) => {
        const node = data.nodes[nodeId];
        const isStaticNode = !("agent" in node);
        (0, nodeValidator_1.nodeValidator)(node);
        const agentId = isStaticNode ? "" : node.agent;
        isStaticNode && (0, static_node_validator_1.staticNodeValidator)(node) && staticNodeIds.push(nodeId);
        !isStaticNode && (0, computed_node_validator_1.computedNodeValidator)(node) && computedNodeIds.push(nodeId) && typeof agentId === "string" && graphAgentIds.add(agentId);
    });
    (0, agent_validator_1.agentValidator)(graphAgentIds, new Set(agentIds));
    (0, relation_validator_1.relationValidator)(data, staticNodeIds, computedNodeIds);
    return true;
};
exports.validateGraphData = validateGraphData;
const validateAgent = (agentFunctionInfoDictionary) => {
    Object.keys(agentFunctionInfoDictionary).forEach((agentId) => {
        if (agentId !== "default") {
            const agentInfo = agentFunctionInfoDictionary[agentId];
            if (!agentInfo || !agentInfo.agent) {
                throw new common_1.ValidationError("No Agent: " + agentId + " is not in AgentFunctionInfoDictionary.");
            }
        }
    });
};
exports.validateAgent = validateAgent;
