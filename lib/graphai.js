"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphAI = exports.NodeState = void 0;
var NodeState;
(function (NodeState) {
    NodeState["Waiting"] = "waiting";
    NodeState["Executing"] = "executing";
    NodeState["Failed"] = "failed";
    NodeState["TimedOut"] = "timed-out";
    NodeState["Completed"] = "completed";
    NodeState["Injected"] = "injected";
    NodeState["Dispatched"] = "dispatched";
})(NodeState || (exports.NodeState = NodeState = {}));
class Node {
    constructor(nodeId, data, graph) {
        this.waitlist = new Set(); // List of nodes which need data from this node.
        this.state = NodeState.Waiting;
        this.result = undefined;
        this.retryCount = 0;
        this.nodeId = nodeId;
        this.inputs = data.inputs ?? [];
        this.pendings = new Set(this.inputs);
        this.params = data.params;
        this.agentId = data.agentId;
        this.retryLimit = data.retry ?? 0;
        this.timeout = data.timeout;
        this.source = data.source === true;
        this.outputs = data.outputs;
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
            this.transactionId = undefined; // This is necessary for timeout case
            this.graph.removeRunning(this);
        }
    }
    removePending(nodeId) {
        this.pendings.delete(nodeId);
        if (this.graph.isRunning) {
            this.pushQueueIfReady();
        }
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
                result,
            };
            log.endTime = log.startTime;
            this.graph.appendLog(log);
            this.setResult(result, NodeState.Injected);
        }
        else {
            console.error("- injectResult called on non-source node.", this.nodeId);
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
            agentId: this.agentId,
            params: this.params,
        };
        const results = this.graph.resultsOf(this.inputs);
        if (results.length > 0) {
            log.inputs = results;
        }
        this.graph.appendLog(log);
        this.state = NodeState.Executing;
        const transactionId = log.startTime;
        this.transactionId = transactionId;
        if (this.timeout && this.timeout > 0) {
            setTimeout(() => {
                if (this.state === NodeState.Executing && this.transactionId === transactionId) {
                    console.log(`-- ${this.nodeId}: timeout ${this.timeout}`);
                    log.errorMessage = "Timeout";
                    log.state = NodeState.TimedOut;
                    log.endTime = Date.now();
                    this.retry(NodeState.TimedOut, Error("Timeout"));
                }
            }, this.timeout);
        }
        try {
            const callback = this.graph.getCallback(this.agentId);
            const result = await callback({
                nodeId: this.nodeId,
                retry: this.retryCount,
                params: this.params,
                inputs: results,
            });
            if (this.transactionId !== transactionId) {
                console.log(`-- ${this.nodeId}: transactionId mismatch`);
                return;
            }
            log.endTime = Date.now();
            log.result = result;
            const outputs = this.outputs;
            if (outputs !== undefined) {
                Object.keys(result).forEach((outputId) => {
                    const nodeId = outputs[outputId];
                    this.graph.injectResult(nodeId, result[outputId]);
                });
                log.state = NodeState.Dispatched;
                this.state = NodeState.Dispatched;
                this.graph.removeRunning(this);
                return;
            }
            log.state = NodeState.Completed;
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
                log.errorMessage = error.message;
                this.retry(NodeState.Failed, error);
            }
            else {
                console.error(`-- ${this.nodeId}: Unexpecrted error was caught`);
                log.errorMessage = "Unknown";
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
        this.callbackDictonary = typeof callbackDictonary === "function" ? { _default: callbackDictonary } : callbackDictonary;
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
    getCallback(_agentId) {
        const agentId = _agentId ?? "_default";
        console.log(agentId);
        if (this.callbackDictonary[agentId]) {
            return this.callbackDictonary[agentId];
        }
        throw new Error("No agent: " + agentId);
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
    resultsOf(nodeIds) {
        return nodeIds.map((nodeId) => {
            return this.nodes[nodeId].result;
        });
    }
}
exports.GraphAI = GraphAI;
