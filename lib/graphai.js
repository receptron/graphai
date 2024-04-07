"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphAI = exports.NodeState = void 0;
var NodeState;
(function (NodeState) {
    NodeState[NodeState["Waiting"] = 0] = "Waiting";
    NodeState[NodeState["Executing"] = 1] = "Executing";
    NodeState[NodeState["Failed"] = 2] = "Failed";
    NodeState[NodeState["TimedOut"] = 3] = "TimedOut";
    NodeState[NodeState["Completed"] = 4] = "Completed";
})(NodeState || (exports.NodeState = NodeState = {}));
class Node {
    constructor(nodeId, data, graph) {
        this.nodeId = nodeId;
        this.inputs = data.inputs ?? [];
        this.pendings = new Set(this.inputs);
        this.params = data.params;
        this.waitlist = new Set();
        this.state = NodeState.Waiting;
        this.functionName = data.functionName ?? "default";
        this.result = {};
        this.retryLimit = data.retry ?? 0;
        this.retryCount = 0;
        this.timeout = data.timeout ?? 0;
        this.graph = graph;
    }
    asString() {
        return `${this.nodeId}: ${this.state} ${[...this.waitlist]}`;
    }
    retry(state, result) {
        if (this.retryCount < this.retryLimit) {
            this.retryCount++;
            this.execute();
        }
        else {
            this.state = state;
            this.result = result;
            this.graph.removeRunning(this);
        }
    }
    removePending(nodeId) {
        this.pendings.delete(nodeId);
        this.pushQueueIfReady();
    }
    payload() {
        return this.inputs.reduce((results, nodeId) => {
            results[nodeId] = this.graph.nodes[nodeId].result;
            return results;
        }, {});
    }
    pushQueueIfReady() {
        if (this.pendings.size === 0) {
            this.graph.pushQueue(this);
        }
    }
    async execute() {
        this.state = NodeState.Executing;
        const transactionId = Date.now();
        this.transactionId = transactionId;
        if (this.timeout > 0) {
            setTimeout(() => {
                if (this.state === NodeState.Executing && this.transactionId === transactionId) {
                    console.log("*** timeout", this.timeout);
                    this.retry(NodeState.TimedOut, {});
                }
            }, this.timeout);
        }
        try {
            const callback = this.graph.getCallback(this.functionName);
            const result = await callback({
                nodeId: this.nodeId,
                retry: this.retryCount,
                params: this.params,
                payload: this.payload(),
            });
            if (this.transactionId !== transactionId) {
                console.log("****** transactionId mismatch (success)");
                return;
            }
            this.state = NodeState.Completed;
            this.result = result;
            this.waitlist.forEach((nodeId) => {
                const node = this.graph.nodes[nodeId];
                node.removePending(this.nodeId);
            });
            this.graph.removeRunning(this);
        }
        catch (e) {
            if (this.transactionId !== transactionId) {
                console.log("****** transactionId mismatch (failed)");
                return;
            }
            this.retry(NodeState.Failed, {});
        }
    }
}
class GraphAI {
    constructor(data, callbackDictonary) {
        this.callbackDictonary = typeof callbackDictonary === "function" ? { default: callbackDictonary } : callbackDictonary;
        if (this.callbackDictonary["default"] === undefined) {
            throw new Error("No default function");
        }
        this.concurrency = data.concurrency ?? 2;
        this.runningNodes = new Set();
        this.nodeQueue = [];
        this.onComplete = () => { };
        this.nodes = Object.keys(data.nodes).reduce((nodes, nodeId) => {
            nodes[nodeId] = new Node(nodeId, data.nodes[nodeId], this);
            return nodes;
        }, {});
        // Generate the waitlist for each node
        Object.keys(this.nodes).forEach((nodeId) => {
            const node = this.nodes[nodeId];
            node.pendings.forEach((pending) => {
                const node2 = this.nodes[pending];
                node2.waitlist.add(nodeId);
            });
        });
    }
    getCallback(functionName) {
        if (functionName && this.callbackDictonary[functionName]) {
            return this.callbackDictonary[functionName];
        }
        return this.callbackDictonary["default"];
    }
    asString() {
        return Object.keys(this.nodes)
            .map((nodeId) => {
            return this.nodes[nodeId].asString();
        })
            .join("\n");
    }
    async run() {
        // Nodes without pending data should run immediately.
        Object.keys(this.nodes).forEach((nodeId) => {
            const node = this.nodes[nodeId];
            node.pushQueueIfReady();
        });
        return new Promise((resolve, reject) => {
            this.onComplete = () => {
                const results = Object.keys(this.nodes).reduce((results, nodeId) => {
                    results[nodeId] = this.nodes[nodeId].result;
                    return results;
                }, {});
                resolve(results);
            };
        });
    }
    runNode(node) {
        this.runningNodes.add(node.nodeId);
        node.execute();
    }
    pushQueue(node) {
        if (this.runningNodes.size < this.concurrency) {
            this.runNode(node);
        }
        else {
            this.nodeQueue.push(node);
        }
    }
    removeRunning(node) {
        this.runningNodes.delete(node.nodeId);
        if (this.nodeQueue.length > 0) {
            const n = this.nodeQueue.shift();
            if (n) {
                this.runNode(n);
            }
        }
        if (this.runningNodes.size === 0) {
            this.onComplete();
        }
    }
}
exports.GraphAI = GraphAI;
