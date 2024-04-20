"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relationValidator = void 0;
const utils_1 = require("../utils/utils");
const relationValidator = (data, staticNodeIds, computedNodeIds) => {
    const nodeIds = new Set(Object.keys(data.nodes));
    const pendings = {};
    const waitlist = {};
    // validate input relation and set pendings and wait list
    computedNodeIds.forEach((computedNodeId) => {
        const nodeData = data.nodes[computedNodeId];
        pendings[computedNodeId] = new Set();
        if (nodeData.inputs) {
            nodeData.inputs.forEach((inputNodeId) => {
                const input = (0, utils_1.parseNodeName)(inputNodeId).nodeId;
                if (!nodeIds.has(input)) {
                    throw new Error(`Inputs not match: NodeId ${computedNodeId}, Inputs: ${input}`);
                }
                waitlist[input] === undefined && (waitlist[input] = new Set());
                pendings[computedNodeId].add(input);
                waitlist[input].add(computedNodeId);
            });
        }
    });
    // TODO. validate update
    staticNodeIds.forEach((staticNodeId) => {
        const update = data.nodes[staticNodeId].update;
        if (update) {
            const updateNodeId = (0, utils_1.parseNodeName)(update).nodeId;
            if (!nodeIds.has(updateNodeId)) {
                throw new Error(`Update not match: NodeId ${staticNodeId}, update: ${update}`);
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
        throw new Error("No Initial Runnning Node");
    }
    do {
        runningQueue = cycle(runningQueue);
    } while (runningQueue.length > 0);
    if (Object.keys(pendings).length > 0) {
        throw new Error("Some nodes are not executed: " + Object.keys(pendings).join(", "));
    }
};
exports.relationValidator = relationValidator;
