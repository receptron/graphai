"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphAI = exports.graphDataLatestVersion = exports.defaultConcurrency = void 0;
const node_1 = require("./node");
const result_1 = require("./utils/result");
const prop_function_1 = require("./utils/prop_function");
const utils_1 = require("./utils/utils");
const data_source_1 = require("./utils/data_source");
const validator_1 = require("./validator");
const task_manager_1 = require("./task_manager");
const GraphAILogger_1 = require("./utils/GraphAILogger");
exports.defaultConcurrency = 8;
exports.graphDataLatestVersion = 0.5;
class GraphAI {
    version;
    graphId;
    graphData;
    staticNodeInitData = {};
    loop;
    forceLoop;
    logs = [];
    mapIndex;
    bypassAgentIds;
    config = {};
    agentFunctionInfoDictionary;
    taskManager;
    agentFilters;
    retryLimit;
    propFunctions;
    graphLoader;
    nodes;
    onLogCallback = (__log, __isUpdate) => { };
    callbacks = [];
    verbose; // REVIEW: Do we need this?
    onComplete;
    repeatCount = 0;
    // This method is called when either the GraphAI obect was created,
    // or we are about to start n-th iteration (n>2).
    createNodes(graphData) {
        const nodes = Object.keys(graphData.nodes).reduce((_nodes, nodeId) => {
            const nodeData = graphData.nodes[nodeId];
            if ((0, utils_1.isComputedNodeData)(nodeData)) {
                _nodes[nodeId] = new node_1.ComputedNode(this.graphId, nodeId, nodeData, this);
            }
            else {
                const updateValue = this.staticNodeInitData[nodeId];
                _nodes[nodeId] = new node_1.StaticNode(nodeId, updateValue !== undefined ? { ...nodeData, value: updateValue } : nodeData, this);
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
                        throw new Error(`createNode: invalid input ${pending} for node, ${nodeId}`);
                    }
                });
            }
        });
        return nodes;
    }
    getValueFromResults(source, results) {
        return (0, data_source_1.getDataFromSource)(source.nodeId ? results[source.nodeId] : undefined, source, this.propFunctions);
    }
    // for static
    setStaticNodeResults(enableConsoleLog = false) {
        // If the result property is specified, inject it.
        // If the previousResults exists (indicating we are in a loop),
        // process the update property (nodeId or nodeId.propId).
        Object.keys(this.graphData.nodes).forEach((nodeId) => {
            const node = this.nodes[nodeId];
            if (node?.isStaticNode) {
                const value = node?.value;
                if (value !== undefined) {
                    node.setResultValue(nodeId);
                }
                if (enableConsoleLog) {
                    node.consoleLog();
                }
            }
        });
    }
    updateStaticNodes(previousResults, enableConsoleLog = false) {
        // If the result property is specified, inject it.
        // If the previousResults exists (indicating we are in a loop),
        // process the update property (nodeId or nodeId.propId).
        Object.keys(this.graphData.nodes).forEach((nodeId) => {
            const node = this.nodes[nodeId];
            if (node?.isStaticNode) {
                const update = node?.update;
                if (update && previousResults) {
                    const result = this.getValueFromResults(update, previousResults);
                    this.updateStaticNodeValue(nodeId, result, update.nodeId);
                }
                if (enableConsoleLog) {
                    node.consoleLog();
                }
            }
        });
    }
    constructor(graphData, agentFunctionInfoDictionary, options = {
        taskManager: undefined,
        agentFilters: [],
        bypassAgentIds: [],
        config: {},
        graphLoader: undefined,
        forceLoop: false,
        mapIndex: undefined,
    }) {
        if (!graphData.version && !options.taskManager) {
            GraphAILogger_1.GraphAILogger.warn("------------ missing version number");
        }
        this.version = graphData.version ?? exports.graphDataLatestVersion;
        if (this.version < exports.graphDataLatestVersion) {
            GraphAILogger_1.GraphAILogger.warn(`------------ upgrade to ${exports.graphDataLatestVersion}!`);
        }
        this.retryLimit = graphData.retry; // optional
        this.graphId = `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`; // URL.createObjectURL(new Blob()).slice(-36);
        this.agentFunctionInfoDictionary = agentFunctionInfoDictionary;
        this.propFunctions = prop_function_1.propFunctions;
        this.taskManager = options.taskManager ?? new task_manager_1.TaskManager(graphData.concurrency ?? exports.defaultConcurrency);
        this.agentFilters = options.agentFilters ?? [];
        this.bypassAgentIds = options.bypassAgentIds ?? [];
        this.config = options.config;
        this.graphLoader = options.graphLoader;
        this.forceLoop = options.forceLoop ?? false;
        this.mapIndex = options.mapIndex;
        this.loop = graphData.loop;
        this.verbose = graphData.verbose === true;
        this.onComplete = (__isAbort) => {
            throw new Error("SOMETHING IS WRONG: onComplete is called without run()");
        };
        (0, validator_1.validateGraphData)(graphData, [...Object.keys(agentFunctionInfoDictionary), ...this.bypassAgentIds]);
        (0, validator_1.validateAgent)(agentFunctionInfoDictionary);
        this.graphData = {
            ...graphData,
            nodes: {
                ...graphData.nodes,
                [utils_1.loopCounterKey]: { value: 0, update: `:${utils_1.loopCounterKey}.add(1)` },
            },
        };
        this.nodes = this.createNodes(this.graphData);
    }
    getAgentFunctionInfo(agentId, nodeId) {
        if (agentId && this.agentFunctionInfoDictionary[agentId]) {
            return this.agentFunctionInfoDictionary[agentId];
        }
        if (agentId && this.bypassAgentIds.includes(agentId)) {
            return {
                agent: async () => {
                    return null;
                },
                hasGraphData: false,
                inputs: null,
                cacheType: undefined, // for node.getContext
            };
        }
        // We are not supposed to hit this error because the validator will catch it.
        if (nodeId) {
            throw new Error(`No agent: ${agentId} in ${nodeId} node`);
        }
        throw new Error("No agent: " + agentId);
    }
    asString() {
        return Object.values(this.nodes)
            .map((node) => node.asString())
            .join("\n");
    }
    // Public API
    results(all, internalUse = false) {
        return Object.keys(this.nodes)
            .filter((nodeId) => (all && (internalUse || nodeId !== utils_1.loopCounterKey)) || this.nodes[nodeId].isResult)
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
        node.beforeAddTask();
        this.taskManager.addTask(node, this.graphId, (_node) => {
            (0, utils_1.assert)(node.nodeId === _node.nodeId, "GraphAI.pushQueue node mismatch");
            node.execute();
        });
    }
    // Public API
    async run(all = false) {
        this.setStaticNodeResults();
        const invalidStaticNodes = Object.values(this.nodes)
            .filter((node) => node.isStaticNode)
            .filter((node) => node.result === undefined && node.update === undefined);
        if (invalidStaticNodes.length > 0) {
            const nodeIds = invalidStaticNodes.map((node) => node.nodeId).join(", ");
            throw new Error(`Static node(s) must have value. Set value, injectValue, or set update. Affected nodeIds: ${nodeIds}`);
        }
        if (this.isRunning()) {
            throw new Error("This GraphAI instance is already running");
        }
        this.pushReadyNodesIntoQueue();
        if (!this.isRunning()) {
            GraphAILogger_1.GraphAILogger.warn("-- nothing to execute");
            return {};
        }
        return new Promise((resolve, reject) => {
            this.onComplete = (isAbort = false) => {
                const errors = this.errors();
                const errorNodeIds = Object.keys(errors);
                if (errorNodeIds.length > 0 || isAbort) {
                    reject(errors[errorNodeIds[0]]);
                }
                else {
                    resolve(this.results(all));
                }
            };
        });
    }
    abort(isChild = false) {
        if (this.isRunning()) {
            this.resetPending();
            // Stop All Running node.
        }
        // For an agent like an event agent, where an external promise remains unresolved,
        // aborting and then retrying can cause nodes or the graph to execute again.
        // To prevent this, the transactionId is updated to ensure the retry fails.
        Object.values(this.nodes).forEach((node) => node.isComputedNode && (node.transactionId = undefined));
        if (!isChild) {
            this.taskManager.reset();
        }
        this.onComplete(this.isRunning());
    }
    resetPending() {
        Object.values(this.nodes).map((node) => {
            if (node.isComputedNode) {
                node.resetPending();
            }
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
        if (this.verbose) {
            const notExecutedNodes = Object.values(this.nodes).filter((node) => node.isComputedNode && node.state !== "completed");
            if (notExecutedNodes.length > 0) {
                console.log("Those nodes are not running. " + notExecutedNodes.map((node) => `${node.nodeId}: ${node.state}`).join(", "));
            }
        }
        this.onComplete(false); // Nothing to run. Finish it.
    }
    // Must be called only from onExecutionComplete righ after removeRunning
    // Check if there is any running computed nodes.
    // In case of no running computed note, start the another iteration if ncessary (loop)
    processLoopIfNecessary() {
        //
        if (!this.forceLoop && Object.keys(this.errors()).length > 0) {
            return false;
        }
        this.repeatCount++;
        const loop = this.loop;
        if (!loop) {
            return false;
        }
        // We need to update static nodes, before checking the condition
        const previousResults = this.results(true, true); // results from previous loop
        this.updateStaticNodes(previousResults);
        this.setStaticNodeResults();
        if (loop.count === undefined || this.repeatCount < loop.count) {
            if (loop.while) {
                const source = (0, utils_1.parseNodeName)(loop.while);
                const value = this.getValueFromResults(source, this.results(true, true));
                // NOTE: We treat an empty array as false.
                if (!(0, utils_1.isLogicallyTrue)(value)) {
                    return false; // while condition is not met
                }
            }
            this.nodes = this.createNodes(this.graphData);
            this.updateStaticNodes(previousResults, true);
            this.setStaticNodeResults();
            this.pushReadyNodesIntoQueue();
            return true; // Indicating that we are going to continue.
        }
        return false;
    }
    initializeGraphAI() {
        if (this.isRunning()) {
            throw new Error("This GraphAI instance is running");
        }
        this.nodes = this.createNodes(this.graphData);
        this.setStaticNodeResults();
    }
    setPreviousResults(previousResults) {
        this.updateStaticNodes(previousResults);
    }
    setLoopLog(log) {
        log.isLoop = !!this.loop;
        log.repeatCount = this.repeatCount;
    }
    appendLog(log) {
        this.logs.push(log);
        this.onLogCallback(log, false);
        this.callbacks.forEach((callback) => callback(log, false));
    }
    updateLog(log) {
        this.onLogCallback(log, true);
        this.callbacks.forEach((callback) => callback(log, false));
    }
    registerCallback(callback) {
        this.callbacks.push(callback);
    }
    clearCallbacks() {
        this.callbacks = [];
    }
    // Public API
    transactionLogs() {
        return this.logs;
    }
    // Public API
    injectValue(nodeId, value, injectFrom) {
        this.staticNodeInitData[nodeId] = value;
        this.updateStaticNodeValue(nodeId, value, injectFrom);
    }
    setLoopCount(count) {
        this.loop = {
            count,
        };
    }
    updateStaticNodeValue(nodeId, value, injectFrom) {
        const node = this.nodes[nodeId];
        if (node && node.isStaticNode) {
            node.updateValue(value, injectFrom);
        }
        else {
            throw new Error(`injectValue with Invalid nodeId, ${nodeId}`);
        }
    }
    resultsOf(inputs, anyInput = false) {
        const results = (0, result_1.resultsOf)(inputs ?? {}, this.nodes, this.propFunctions);
        if (anyInput) {
            return (0, result_1.cleanResult)(results);
        }
        return results;
    }
    resultOf(source) {
        return (0, result_1.resultOf)(source, this.nodes, this.propFunctions);
    }
}
exports.GraphAI = GraphAI;
