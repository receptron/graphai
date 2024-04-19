"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphAI = void 0;
const node_1 = require("./node");
const utils_1 = require("./utils/utils");
const validator_1 = require("./validator");
const defaultConcurrency = 8;
class GraphAI {
    // This method is called when either the GraphAI obect was created,
    // or we are about to start n-th iteration (n>2).
    createNodes(data) {
        const nodeId2forkedNodeIds = {};
        const forkedNodeId2Index = {};
        const forkedNodeId2NodeId = {}; // for sources
        const nodes = Object.keys(data.nodes).reduce((_nodes, nodeId) => {
            const isStaticNode = (data.nodes[nodeId].agentId ?? data.agentId) === undefined;
            if (isStaticNode) {
                _nodes[nodeId] = new node_1.StaticNode(nodeId, data.nodes[nodeId], this);
            }
            else {
                const fork = data.nodes[nodeId].fork;
                if (fork) {
                    // For fork, change the nodeId and increase the node
                    nodeId2forkedNodeIds[nodeId] = new Array(fork).fill(undefined).map((_, i) => {
                        const forkedNodeId = `${nodeId}_${i}`;
                        _nodes[forkedNodeId] = new node_1.ComputedNode(forkedNodeId, i, data.nodes[nodeId], this);
                        // Data for pending and waiting
                        forkedNodeId2Index[forkedNodeId] = i;
                        forkedNodeId2NodeId[forkedNodeId] = nodeId;
                        return forkedNodeId;
                    });
                }
                else {
                    _nodes[nodeId] = new node_1.ComputedNode(nodeId, undefined, data.nodes[nodeId], this);
                }
            }
            return _nodes;
        }, {});
        // Generate the waitlist for each node, and update the pendings in case of forked node.
        Object.keys(nodes).forEach((nodeId) => {
            const node = nodes[nodeId];
            if (node.isComputedNode) {
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
                        if (nodes[pending]) {
                            nodes[pending].waitlist.add(nodeId); // previousNode
                        }
                        else {
                            console.error(`--- invalid input ${pending} for node, ${nodeId}`);
                        }
                    }
                });
                node.inputs = Array.from(node.pendings); // for fork.
                node.sources = node.inputs.reduce((sources, input) => {
                    const refNodeId = forkedNodeId2NodeId[input] ?? input;
                    sources[input] = { nodeId: input, propId: node.sources[refNodeId].propId };
                    return sources;
                }, {});
            }
        });
        return nodes;
    }
    getValueFromResults(key, results) {
        const source = (0, utils_1.parseNodeName)(key);
        const result = results[source.nodeId];
        return result && source.propId ? result[source.propId] : result;
    }
    // for static
    initializeNodes(previousResults) {
        // If the result property is specified, inject it.
        // If the previousResults exists (indicating we are in a loop),
        // process the update property (nodeId or nodeId.propId).
        Object.keys(this.data.nodes).forEach((nodeId) => {
            const node = this.nodes[nodeId];
            if (node?.isStaticNode) {
                const value = node?.value;
                const update = node?.update;
                if (value) {
                    this.injectValue(nodeId, value);
                }
                if (update && previousResults) {
                    const result = this.getValueFromResults(update, previousResults);
                    if (result) {
                        this.injectValue(nodeId, result);
                    }
                }
            }
        });
    }
    constructor(data, callbackDictonary) {
        this.isRunning = false;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.onLogCallback = (_log, _isUpdate) => { };
        this.runningNodes = new Set();
        this.nodeQueue = []; // for Computed Node
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
        (0, validator_1.validateGraphData)(data);
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
            if (node.isComputedNode) {
                if (node.error !== undefined) {
                    errors[nodeId] = node.error;
                }
            }
            return errors;
        }, {});
    }
    pushReadyNodesIntoQueue() {
        // Nodes without pending data should run immediately.
        Object.keys(this.nodes).forEach((nodeId) => {
            const node = this.nodes[nodeId];
            if (node.isComputedNode) {
                node.pushQueueIfReady();
            }
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
    // for computed
    runNode(node) {
        this.runningNodes.add(node.nodeId);
        node.execute();
    }
    // for computed
    pushQueue(node) {
        if (this.runningNodes.size < this.concurrency) {
            this.runNode(node);
        }
        else {
            this.nodeQueue.push(node);
        }
    }
    // for completed
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
            const loop = this.loop;
            if (loop && (loop.count === undefined || this.repeatCount < loop.count)) {
                const results = this.results(); // results from previous loop
                this.isRunning = false; // temporarily stop it
                this.nodes = this.createNodes(this.data);
                this.initializeNodes(results);
                const checkWhileCondition = () => {
                    if (loop.while) {
                        const value = this.getValueFromResults(loop.while, this.results());
                        // NOTE: We treat an empty array as false.
                        return Array.isArray(value) ? value.length > 0 : !!value;
                    }
                    return true;
                };
                if (checkWhileCondition()) {
                    this.isRunning = true; // restore it
                    this.pushReadyNodesIntoQueue();
                    return;
                }
            }
            this.onComplete();
        }
    }
    appendLog(log) {
        this.logs.push(log);
        this.onLogCallback(log, false);
    }
    updateLog(log) {
        this.onLogCallback(log, true);
    }
    transactionLogs() {
        return this.logs;
    }
    injectValue(nodeId, value) {
        const node = this.nodes[nodeId];
        if (node && node.isStaticNode) {
            node.injectValue(value);
        }
        else {
            console.error("-- Invalid nodeId", nodeId);
        }
    }
    resultsOf(sources) {
        return sources.map((source) => {
            const result = this.nodes[source.nodeId].result;
            return result && source.propId ? result[source.propId] : result;
        });
    }
}
exports.GraphAI = GraphAI;
