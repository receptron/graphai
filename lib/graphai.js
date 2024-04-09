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
    NodeState[NodeState["Injected"] = 5] = "Injected";
    NodeState[NodeState["Dispatched"] = 6] = "Dispatched";
})(NodeState || (exports.NodeState = NodeState = {}));
class Node {
    constructor(nodeId, data, graph) {
        this.waitlist = new Set(); // List of nodes which need data from this node.
        this.state = NodeState.Waiting;
        this.result = undefined;
        this.retryCount = 0;
        this.nodeId = nodeId;
        this.inputs = data.inputs ?? [];
        this.payloadMapping = data.payloadMapping ?? {};
        this.pendings = new Set(this.inputs);
        this.params = data.params;
        this.functionName = data.functionName ?? "default";
        this.retryLimit = data.retry ?? 0;
        this.timeout = data.timeout ?? 0;
        this.source = data.source === true;
        this.dispatch = data.dispatch;
        this.graph = graph;
    }
    asString() {
        return `${this.nodeId}: ${this.state} ${[...this.waitlist]}`;
    }
    retry(state, error) {
        if (this.retryCount < this.retryLimit) {
            this.retryCount++;
            this.execute();
        }
        else {
            this.state = state;
            this.result = undefined;
            this.error = error;
            this.transactionId = 0; // This is necessary for timeout case
            this.graph.removeRunning(this);
        }
    }
    removePending(nodeId) {
        this.pendings.delete(nodeId);
        if (this.graph.isRunning) {
            this.pushQueueIfReady();
        }
    }
    payload() {
        return this.inputs.reduce((results, nodeId) => {
            if (this.payloadMapping && this.payloadMapping[nodeId]) {
                results[this.payloadMapping[nodeId]] = this.graph.nodes[nodeId].result;
            }
            else {
                results[nodeId] = this.graph.nodes[nodeId].result;
            }
            return results;
        }, {});
    }
    pushQueueIfReady() {
        if (this.pendings.size === 0 && !this.source) {
            this.graph.pushQueue(this);
        }
    }
    injectResult(result) {
        if (this.source) {
            const log = {
                nodeId: this.nodeId,
                retryCount: this.retryCount,
                state: NodeState.Injected,
                startTime: Date.now(),
            };
            log.endTime = log.startTime;
            this.graph.appendLog(log);
            this.setResult(result, NodeState.Injected);
        }
    }
    setResult(result, state) {
        this.state = state;
        this.result = result;
        this.waitlist.forEach((nodeId) => {
            const node = this.graph.nodes[nodeId];
            // Todo: Avoid running before Run()
            node.removePending(this.nodeId);
        });
    }
    async execute() {
        const log = {
            nodeId: this.nodeId,
            retryCount: this.retryCount,
            state: NodeState.Executing,
            startTime: Date.now(),
        };
        this.graph.appendLog(log);
        this.state = NodeState.Executing;
        const transactionId = log.startTime;
        this.transactionId = transactionId;
        if (this.timeout > 0) {
            setTimeout(() => {
                if (this.state === NodeState.Executing && this.transactionId === transactionId) {
                    console.log(`-- ${this.nodeId}: timeout ${this.timeout}`);
                    log.error = Error("Timeout");
                    log.state = NodeState.TimedOut;
                    log.endTime = Date.now();
                    this.retry(NodeState.TimedOut, Error("Timeout"));
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
                console.log(`-- ${this.nodeId}: transactionId mismatch`);
                return;
            }
            const dispatch = this.dispatch;
            if (dispatch !== undefined) {
                Object.keys(result).forEach(outputId => {
                    const nodeId = dispatch[outputId];
                    this.graph.injectResult(nodeId, result[outputId]);
                });
                this.state = NodeState.Dispatched;
                this.graph.removeRunning(this);
                return;
            }
            log.state = NodeState.Completed;
            log.endTime = Date.now();
            log.result = result;
            this.setResult(result, NodeState.Completed);
            this.graph.removeRunning(this);
        }
        catch (error) {
            if (this.transactionId !== transactionId) {
                console.log(`-- ${this.nodeId}: transactionId mismatch(error)`);
                return;
            }
            log.state = NodeState.Failed;
            log.endTime = Date.now();
            if (error instanceof Error) {
                log.error = error;
                this.retry(NodeState.Failed, error);
            }
            else {
                console.error(`-- ${this.nodeId}: Unexpecrted error was caught`);
                log.error = Error("Unknown");
                this.retry(NodeState.Failed, Error("Unknown"));
            }
        }
    }
}
const defaultConcurrency = 8;
class GraphAI {
    constructor(data, callbackDictonary) {
        this.isRunning = false;
        this.runningNodes = new Set();
        this.nodeQueue = [];
        this.logs = [];
        this.callbackDictonary = typeof callbackDictonary === "function" ? { default: callbackDictonary } : callbackDictonary;
        if (this.callbackDictonary["default"] === undefined) {
            throw new Error("No default function");
        }
        this.concurrency = data.concurrency ?? defaultConcurrency;
        this.onComplete = () => {
            console.error("-- SOMETHING IS WRONG: onComplete is called without run()");
        };
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
    results() {
        return Object.keys(this.nodes).reduce((results, nodeId) => {
            const node = this.nodes[nodeId];
            if (node.result !== undefined) {
                results[nodeId] = node.result;
            }
            return results;
        }, {});
    }
    errors() {
        return Object.keys(this.nodes).reduce((errors, nodeId) => {
            const node = this.nodes[nodeId];
            if (node.error !== undefined) {
                errors[nodeId] = node.error;
            }
            return errors;
        }, {});
    }
    async run() {
        if (this.isRunning) {
            console.error("-- Already Running");
        }
        this.isRunning = true;
        // Nodes without pending data should run immediately.
        Object.keys(this.nodes).forEach((nodeId) => {
            const node = this.nodes[nodeId];
            node.pushQueueIfReady();
        });
        return new Promise((resolve, reject) => {
            this.onComplete = () => {
                this.isRunning = false;
                const errors = this.errors();
                const nodeIds = Object.keys(errors);
                if (nodeIds.length > 0) {
                    reject(errors[nodeIds[0]]);
                }
                else {
                    resolve(this.results());
                }
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
    appendLog(log) {
        this.logs.push(log);
    }
    transactionLogs() {
        return this.logs;
    }
    injectResult(nodeId, result) {
        const node = this.nodes[nodeId];
        if (node) {
            node.injectResult(result);
        }
        else {
            console.error("-- Invalid nodeId", nodeId);
        }
    }
}
exports.GraphAI = GraphAI;
