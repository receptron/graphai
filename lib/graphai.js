"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphAI = void 0;
const type_1 = require("./type");
const node_1 = require("./node");
const utils_1 = require("./utils/utils");
const validator_1 = require("./validator");
const task_manager_1 = require("./task_manager");
const defaultConcurrency = 8;
class GraphAI {
    // This method is called when either the GraphAI obect was created,
    // or we are about to start n-th iteration (n>2).
    createNodes(data) {
        const nodes = Object.keys(data.nodes).reduce((_nodes, nodeId) => {
            const isStaticNode = "value" in data.nodes[nodeId];
            if (isStaticNode) {
                _nodes[nodeId] = new node_1.StaticNode(nodeId, data.nodes[nodeId], this);
            }
            else {
                const nodeData = data.nodes[nodeId];
                _nodes[nodeId] = new node_1.ComputedNode(this.graphId, nodeId, nodeData, this);
            }
            return _nodes;
        }, {});
        // Generate the waitlist for each node.
        Object.keys(nodes).forEach((nodeId) => {
            const node = nodes[nodeId];
            if (node.isComputedNode) {
                node.pendings.forEach((pending) => {
                    if (nodes[pending]) {
                        nodes[pending].waitlist.add(nodeId); // previousNode
                    }
                    else {
                        console.error(`--- invalid input ${pending} for node, ${nodeId}`);
                    }
                });
            }
        });
        return nodes;
    }
    getValueFromResults(key, results) {
        const source = (0, utils_1.parseNodeName)(key);
        return (0, utils_1.getDataFromSource)(results[source.nodeId], source);
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
                    this.injectValue(nodeId, value, nodeId);
                }
                if (update && previousResults) {
                    const result = this.getValueFromResults(update, previousResults);
                    if (result) {
                        this.injectValue(nodeId, result, update);
                    }
                }
            }
        });
    }
    constructor(data, callbackDictonary, taskManager = undefined) {
        this.logs = [];
        this.onLogCallback = (__log, __isUpdate) => { };
        this.repeatCount = 0;
        this.graphId = URL.createObjectURL(new Blob()).slice(-36);
        this.data = data;
        this.callbackDictonary = callbackDictonary;
        this.taskManager = taskManager ?? new task_manager_1.TaskManager(data.concurrency ?? defaultConcurrency);
        this.loop = data.loop;
        this.verbose = data.verbose === true;
        this.onComplete = () => {
            console.error("-- SOMETHING IS WRONG: onComplete is called without run()");
        };
        (0, validator_1.validateGraphData)(data, Object.keys(callbackDictonary));
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
        return Object.values(this.nodes)
            .map((node) => node.asString())
            .join("\n");
    }
    // Public API
    results(all) {
        return Object.keys(this.nodes)
            .filter((nodeId) => all || this.nodes[nodeId].isResult)
            .reduce((results, nodeId) => {
            const node = this.nodes[nodeId];
            if (node.result !== undefined) {
                results[nodeId] = node.result;
            }
            return results;
        }, {});
    }
    // Public API
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
                this.pushQueueIfReady(node);
            }
        });
    }
    pushQueueIfReady(node) {
        if (node.isReadyNode()) {
            this.pushQueue(node);
        }
    }
    pushQueueIfReadyAndRunning(node) {
        if (this.isRunning()) {
            this.pushQueueIfReady(node);
        }
    }
    // for computed
    pushQueue(node) {
        node.state = type_1.NodeState.Queued;
        this.taskManager.addTask(node, this.graphId, (_node) => {
            (0, utils_1.assert)(node.nodeId === _node.nodeId, "GraphAI.pushQueue node mismatch");
            node.execute();
        });
    }
    // Public API
    async run(all = false) {
        if (this.isRunning()) {
            console.error("-- Already Running");
        }
        this.pushReadyNodesIntoQueue();
        if (!this.isRunning()) {
            console.warn("-- nothing to execute");
            return {};
        }
        return new Promise((resolve, reject) => {
            this.onComplete = () => {
                const errors = this.errors();
                const nodeIds = Object.keys(errors);
                if (nodeIds.length > 0) {
                    reject(errors[nodeIds[0]]);
                }
                else {
                    resolve(this.results(all));
                }
            };
        });
    }
    // Public only for testing
    isRunning() {
        return this.taskManager.isRunning(this.graphId);
    }
    // callback from execute
    onExecutionComplete(node) {
        this.taskManager.onComplete(node);
        if (this.isRunning() || this.processLoopIfNecessary()) {
            return; // continue running
        }
        this.onComplete(); // Nothing to run. Finish it.
    }
    // Must be called only from onExecutionComplete righ after removeRunning
    // Check if there is any running computed nodes.
    // In case of no running computed note, start the another iteration if ncessary (loop)
    processLoopIfNecessary() {
        this.repeatCount++;
        const loop = this.loop;
        if (loop && (loop.count === undefined || this.repeatCount < loop.count)) {
            const results = this.results(true); // results from previous loop
            this.nodes = this.createNodes(this.data);
            this.initializeNodes(results);
            // Notice that we need to check the while condition *after* calling initializeNodes.
            if (loop.while) {
                const value = this.getValueFromResults(loop.while, this.results(true));
                // NOTE: We treat an empty array as false.
                if (Array.isArray(value) ? value.length === 0 : !value) {
                    return false; // while condition is not met
                }
            }
            this.pushReadyNodesIntoQueue();
            return true; // Indicating that we are going to continue.
        }
        return false;
    }
    setLoopLog(log) {
        log.isLoop = !!this.loop;
        log.repeatCount = this.repeatCount;
    }
    appendLog(log) {
        this.logs.push(log);
        this.onLogCallback(log, false);
    }
    updateLog(log) {
        this.onLogCallback(log, true);
    }
    // Public API
    transactionLogs() {
        return this.logs;
    }
    // Public API
    injectValue(nodeId, value, injectFrom) {
        const node = this.nodes[nodeId];
        if (node && node.isStaticNode) {
            node.injectValue(value, injectFrom);
        }
        else {
            console.error("-- Inject Error: Invalid nodeId", nodeId);
            console.error("InjectionTo can only specify static nodes");
        }
    }
    resultsOf(sources, ignoreUndefined = false) {
        return sources.map((source) => {
            const { result } = this.nodes[source.nodeId];
            if (source.propId && !ignoreUndefined) {
                (0, utils_1.assert)((0, utils_1.isObject)(result), `resultsOf: result is not object. nodeId ${source.nodeId}`);
            }
            return (0, utils_1.getDataFromSource)(result, source);
        });
    }
}
exports.GraphAI = GraphAI;
