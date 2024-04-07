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
    constructor(nodeId, data) {
        this.nodeId = nodeId;
        this.inputs = data.inputs ?? [];
        this.pendings = new Set(this.inputs);
        this.params = data.params;
        this.waitlist = new Set();
        this.state = NodeState.Waiting;
        this.result = {};
        this.retryLimit = data.retry ?? 0;
        this.retryCount = 0;
        this.timeout = data.timeout ?? 0;
    }
    asString() {
        return `${this.nodeId}: ${this.state} ${[...this.waitlist]}`;
    }
    retry(graph, state, result) {
        if (this.retryCount < this.retryLimit) {
            this.retryCount++;
            this.execute(graph);
        }
        else {
            this.state = state;
            this.result = result;
            graph.removeRunning(this);
        }
    }
    removePending(nodeId, graph) {
        this.pendings.delete(nodeId);
        this.executeIfReady(graph);
    }
    payload(graph) {
        return this.inputs.reduce((results, nodeId) => {
            results[nodeId] = graph.nodes[nodeId].result;
            return results;
        }, {});
    }
    executeIfReady(graph) {
        if (this.pendings.size == 0) {
            graph.addRunning(this);
            this.execute(graph);
        }
    }
    async execute(graph) {
        this.state = NodeState.Executing;
        const transactionId = Date.now();
        this.transactionId = transactionId;
        if (this.timeout > 0) {
            setTimeout(() => {
                if (this.state == NodeState.Executing && this.transactionId == transactionId) {
                    console.log("*** timeout", this.timeout);
                    this.retry(graph, NodeState.TimedOut, {});
                }
            }, this.timeout);
        }
        try {
            const result = await graph.callback({ nodeId: this.nodeId, retry: this.retryCount, params: this.params, payload: this.payload(graph) });
            if (this.transactionId !== transactionId) {
                console.log("****** tid mismatch (success)");
                return;
            }
            this.state = NodeState.Completed;
            this.result = result;
            this.waitlist.forEach((nodeId) => {
                const node = graph.nodes[nodeId];
                node.removePending(this.nodeId, graph);
            });
            graph.removeRunning(this);
        }
        catch (e) {
            if (this.transactionId !== transactionId) {
                console.log("****** tid mismatch (failed)");
                return;
            }
            this.retry(graph, NodeState.Failed, {});
        }
    }
}
class GraphAI {
    constructor(data, callback) {
        this.callback = callback;
        this.runningNodes = new Set();
        this.onComplete = () => { };
        this.nodes = Object.keys(data.nodes).reduce((nodes, nodeId) => {
            nodes[nodeId] = new Node(nodeId, data.nodes[nodeId]);
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
            node.executeIfReady(this);
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
    addRunning(node) {
        this.runningNodes.add(node.nodeId);
    }
    removeRunning(node) {
        this.runningNodes.delete(node.nodeId);
        if (this.runningNodes.size == 0) {
            this.onComplete();
        }
    }
}
exports.GraphAI = GraphAI;
