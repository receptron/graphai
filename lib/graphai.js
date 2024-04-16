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
    constructor(nodeId, forkIndex, data, graph) {
        this.waitlist = new Set(); // List of nodes which need data from this node.
        this.state = NodeState.Waiting;
        this.result = undefined;
        this.retryCount = 0;
        this.nodeId = nodeId;
        this.forkIndex = forkIndex;
        this.inputs = data.inputs ?? [];
        this.pendings = new Set(this.inputs);
        this.params = data.params ?? {};
        this.agentId = data.agentId;
        this.fork = data.fork;
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
                endTime: Date.now(),
                result,
            };
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
        const results = this.graph.resultsOf(this.inputs);
        const transactionId = Date.now();
        const log = {
            nodeId: this.nodeId,
            retryCount: this.retryCount > 0 ? this.retryCount : undefined,
            state: NodeState.Executing,
            startTime: transactionId,
            agentId: this.agentId,
            params: this.params,
            inputs: results.length > 0 ? results : undefined,
        };
        this.graph.appendLog(log);
        this.state = NodeState.Executing;
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
            const callback = this.graph.getCallback(this.agentId ?? this.graph.agentId);
            const localLog = [];
            const result = await callback({
                nodeId: this.nodeId,
                retry: this.retryCount,
                params: this.params,
                inputs: results,
                forkIndex: this.forkIndex,
                verbose: this.graph.verbose,
                agents: this.graph.callbackDictonary,
                log: localLog,
            });
            if (this.transactionId !== transactionId) {
                console.log(`-- ${this.nodeId}: transactionId mismatch`);
                return;
            }
            log.endTime = Date.now();
            log.result = result;
            if (localLog.length > 0) {
                log.log = localLog;
            }
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
    createNodes(data) {
        const nodeId2forkedNodeIds = {};
        const forkedNodeId2Index = {};
        const nodes = Object.keys(data.nodes).reduce((nodes, nodeId) => {
            const fork = data.nodes[nodeId].fork;
            if (fork) {
                // For fork, change the nodeId and increase the node
                nodeId2forkedNodeIds[nodeId] = new Array(fork).fill(undefined).map((_, i) => {
                    const forkedNodeId = `${nodeId}_${i}`;
                    nodes[forkedNodeId] = new Node(forkedNodeId, i, data.nodes[nodeId], this);
                    // Data for pending and waiting
                    forkedNodeId2Index[forkedNodeId] = i;
                    return forkedNodeId;
                });
            }
            else {
                nodes[nodeId] = new Node(nodeId, undefined, data.nodes[nodeId], this);
            }
            return nodes;
        }, {});
        // Generate the waitlist for each node, and update the pendings in case of forked node.
        Object.keys(nodes).forEach((nodeId) => {
            const node = nodes[nodeId];
            node.pendings.forEach((pending) => {
                // If the pending(previous) node is forking
                if (nodeId2forkedNodeIds[pending]) {
                    //  update node.pending and pending(previous) node.wailtlist
                    if (node.fork) {
                        //  1:1 if current nodes are also forking.
                        const newPendingId = nodeId2forkedNodeIds[pending][forkedNodeId2Index[nodeId]];
                        nodes[newPendingId].waitlist.add(nodeId); // previousNode
                        node.pendings.add(newPendingId);
                    }
                    else {
                        //  1:n if current node is not forking.
                        nodeId2forkedNodeIds[pending].forEach((newPendingId) => {
                            nodes[newPendingId].waitlist.add(nodeId); // previousNode
                            node.pendings.add(newPendingId);
                        });
                    }
                    node.pendings.delete(pending);
                }
                else {
                    nodes[pending].waitlist.add(nodeId); // previousNode
                }
            });
            node.inputs = Array.from(node.pendings); // for fork.
        });
        return nodes;
    }
    initializeNodes() {
        // If the result property is specified, inject it.
        // NOTE: This must be done at the end of this constructor
        Object.keys(this.data.nodes).forEach((nodeId) => {
            const result = this.data.nodes[nodeId].result;
            if (result) {
                this.injectResult(nodeId, result);
            }
        });
    }
    constructor(data, callbackDictonary) {
        this.isRunning = false;
        this.runningNodes = new Set();
        this.nodeQueue = [];
        this.repeatCount = 0;
        this.logs = [];
        this.data = data;
        this.callbackDictonary = callbackDictonary;
        this.concurrency = data.concurrency ?? defaultConcurrency;
        this.loop = data.loop;
        this.agentId = data.agentId;
        this.verbose = data.verbose === true;
        this.onComplete = () => {
            console.error("-- SOMETHING IS WRONG: onComplete is called without run()");
        };
        this.nodes = this.createNodes(data);
        this.initializeNodes();
    }
    getCallback(agentId) {
        if (agentId && this.callbackDictonary[agentId]) {
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
    pushReadyNodesIntoQueue() {
        // Nodes without pending data should run immediately.
        Object.keys(this.nodes).forEach((nodeId) => {
            const node = this.nodes[nodeId];
            node.pushQueueIfReady();
        });
    }
    async run() {
        if (this.isRunning) {
            console.error("-- Already Running");
        }
        this.isRunning = true;
        this.pushReadyNodesIntoQueue();
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
            this.repeatCount++;
            if (this.loop && this.repeatCount < this.loop.count) {
                const results = this.results(); // results from previous loop
                this.nodes = this.createNodes(this.data);
                this.initializeNodes();
                // Transer results from previous loop
                const assign = this.loop.assign;
                if (assign) {
                    Object.keys(assign).forEach((sourceNodeId) => {
                        this.injectResult(assign[sourceNodeId], results[sourceNodeId]);
                    });
                }
                this.pushReadyNodesIntoQueue();
            }
            else {
                this.onComplete();
            }
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
