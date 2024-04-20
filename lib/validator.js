"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGraphData = void 0;
const graph_data_validator_1 = require("./validators/graph_data_validator");
const static_node_validator_1 = require("./validators/static_node_validator");
const computed_node_validator_1 = require("./validators/computed_node_validator");
const relation_validator_1 = require("./validators/relation_validator");
const validateGraphData = (data) => {
    (0, graph_data_validator_1.graphNodesValidate)(data);
    const computedNodeIds = [];
    const staticNodeIds = [];
    Object.keys(data.nodes).forEach((nodeId) => {
        const node = data.nodes[nodeId];
        const isStaticNode = (node.agentId ?? data.agentId) === undefined;
        isStaticNode && (0, static_node_validator_1.staticNodeValidator)(node) && staticNodeIds.push(nodeId);
        !isStaticNode && (0, computed_node_validator_1.computedNodeValidator)(node) && computedNodeIds.push(nodeId);
    });
    (0, relation_validator_1.relationValidator)(data, staticNodeIds, computedNodeIds);
    return true;
};
exports.validateGraphData = validateGraphData;
