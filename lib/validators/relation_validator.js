"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relationValidator = void 0;
const relationValidator = (data, staticNodeIds, computedNodeIds) => {
    const nodeIds = Object.keys(data.nodes);
    const pendings = {};
    const waitlist = {};
    // validate input relation and set pendings and wait list
    computedNodeIds.forEach((nodeId) => {
        const nodeData = data.nodes[nodeId];
        pendings[nodeId] = new Set();
        if (nodeData.inputs) {
            nodeData.inputs.forEach((inputNodeId) => {
                const input = inputNodeId.split(".")[0];
                if (!nodeIds.includes(input)) {
                    throw new Error(`Inputs not match: NodeId ${nodeId}, Inputs: ${input}`);
                }
                waitlist[input] === undefined && (waitlist[input] = new Set());
                pendings[nodeId].add(input);
                waitlist[input].add(nodeId);
            });
        }
    });
    // init
    const cycle = (possibles) => {
        possibles.forEach((nodeId) => {
            (waitlist[nodeId] || []).forEach((waitingNodeId) => {
                pendings[waitingNodeId].delete(nodeId);
            });
        });
        const run = [];
        Object.keys(pendings).forEach((pendingNodeId) => {
            if (pendings[pendingNodeId].size === 0) {
                run.push(pendingNodeId);
                delete pendings[pendingNodeId];
            }
        });
        return run;
    };
    let queue = cycle(staticNodeIds);
    if (queue.length === 0) {
        throw new Error("No Initial Runnning Node");
    }
    do {
        queue = cycle(queue);
    } while (queue.length > 0);
    if (Object.keys(pendings).length > 0) {
        throw new Error("Some nodes are not executed: " + Object.keys(pendings).join(", "));
    }
};
exports.relationValidator = relationValidator;
