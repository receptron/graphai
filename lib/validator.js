"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGraphData = void 0;
const graph_data_validator_1 = require("./validators/graph_data_validator");
const static_node_validator_1 = require("./validators/static_node_validator");
const computed_node_validator_1 = require("./validators/computed_node_validator");
const validateGraphData = (data) => {
    (0, graph_data_validator_1.graphNodesValidate)(data);
    Object.keys(data.nodes).forEach((nodeId) => {
        const node = data.nodes[nodeId];
        const isStaticNode = (node.agentId ?? data.agentId) === undefined;
        isStaticNode && (0, static_node_validator_1.staticNodeValidator)(node);
        !isStaticNode && (0, computed_node_validator_1.computedNodeValidator)(node);
    });
    return true;
};
exports.validateGraphData = validateGraphData;
