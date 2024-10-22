"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relationValidator = void 0;
const utils_1 = require("../utils/utils");
const common_1 = require("../validators/common");
const nodeUtils_1 = require("../utils/nodeUtils");
const relationValidator = (data, staticNodeIds, computedNodeIds) => {
    const nodeIds = new Set(Object.keys(data.nodes));
    const pendings = {};
    const waitlist = {};
    // validate input relation and set pendings and wait list
    computedNodeIds.forEach((computedNodeId) => {
        const nodeData = data.nodes[computedNodeId];
        pendings[computedNodeId] = new Set();
        const dataSourceValidator = (sourceType, sourceNodeIds) => {
            sourceNodeIds.forEach((sourceNodeId) => {
                if (sourceNodeId) {
                    if (!nodeIds.has(sourceNodeId)) {
                        throw new common_1.ValidationError(`${sourceType} not match: NodeId ${computedNodeId}, Inputs: ${sourceNodeId}`);
                    }
                    waitlist[sourceNodeId] === undefined && (waitlist[sourceNodeId] = new Set());
                    pendings[computedNodeId].add(sourceNodeId);
                    waitlist[sourceNodeId].add(computedNodeId);
                }
            });
        };
        if ("agent" in nodeData && nodeData) {
            if (nodeData.inputs) {
                const sourceNodeIds = (0, nodeUtils_1.dataSourceNodeIds)((0, nodeUtils_1.inputs2dataSources)(nodeData.inputs));
                dataSourceValidator("Inputs", sourceNodeIds);
            }
            if (nodeData.if) {
                const sourceNodeIds = (0, nodeUtils_1.dataSourceNodeIds)((0, nodeUtils_1.inputs2dataSources)({ if: nodeData.if }));
                dataSourceValidator("If", sourceNodeIds);
            }
            if (nodeData.unless) {
                const sourceNodeIds = (0, nodeUtils_1.dataSourceNodeIds)((0, nodeUtils_1.inputs2dataSources)({ unless: nodeData.unless }));
                dataSourceValidator("Unless", sourceNodeIds);
            }
            if (nodeData.graph && typeof nodeData?.graph === "string") {
                const sourceNodeIds = (0, nodeUtils_1.dataSourceNodeIds)((0, nodeUtils_1.inputs2dataSources)({ graph: nodeData.graph }));
                dataSourceValidator("graph", sourceNodeIds);
            }
        }
    });
    // TODO. validate update
    staticNodeIds.forEach((staticNodeId) => {
        const nodeData = data.nodes[staticNodeId];
        if ("value" in nodeData && nodeData.update) {
            const update = nodeData.update;
            const updateNodeId = (0, utils_1.parseNodeName)(update).nodeId;
            if (!updateNodeId) {
                throw new common_1.ValidationError("Update it a literal");
            }
            if (!nodeIds.has(updateNodeId)) {
                throw new common_1.ValidationError(`Update not match: NodeId ${staticNodeId}, update: ${update}`);
            }
        }
    });
    const cycle = (possibles) => {
        possibles.forEach((possobleNodeId) => {
            (waitlist[possobleNodeId] || []).forEach((waitingNodeId) => {
                pendings[waitingNodeId].delete(possobleNodeId);
            });
        });
        const running = [];
        Object.keys(pendings).forEach((pendingNodeId) => {
            if (pendings[pendingNodeId].size === 0) {
                running.push(pendingNodeId);
                delete pendings[pendingNodeId];
            }
        });
        return running;
    };
    let runningQueue = cycle(staticNodeIds);
    if (runningQueue.length === 0) {
        throw new common_1.ValidationError("No Initial Runnning Node");
    }
    do {
        runningQueue = cycle(runningQueue);
    } while (runningQueue.length > 0);
    if (Object.keys(pendings).length > 0) {
        throw new common_1.ValidationError("Some nodes are not executed: " + Object.keys(pendings).join(", "));
    }
};
exports.relationValidator = relationValidator;
