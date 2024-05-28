(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.GraphAI = factory());
})(this, (function () { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var lib = {};

	var graphai = {};

	var node = {};

	var utils = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.defaultTestContext = exports.isLogicallyTrue = exports.debugResultKey = exports.agentInfoWrapper = exports.defaultAgentInfo = exports.strIntentionalError = exports.getDataFromSource = exports.isObject = exports.assert = exports.parseNodeName = exports.sleep = void 0;
		const sleep = async (milliseconds) => {
		    return await new Promise((resolve) => setTimeout(resolve, milliseconds));
		};
		exports.sleep = sleep;
		const parseNodeName_02 = (inputNodeId) => {
		    if (typeof inputNodeId === "string") {
		        const regex = /^"(.*)"$/;
		        const match = inputNodeId.match(regex);
		        if (match) {
		            return { value: match[1] }; // string literal
		        }
		        const parts = inputNodeId.split(".");
		        if (parts.length == 1) {
		            return { nodeId: parts[0] };
		        }
		        return { nodeId: parts[0], propIds: parts.slice(1) };
		    }
		    return { value: inputNodeId }; // non-string literal
		};
		const parseNodeName = (inputNodeId, version) => {
		    if (version === 0.2) {
		        return parseNodeName_02(inputNodeId);
		    }
		    if (typeof inputNodeId === "string") {
		        const regex = /^:(.*)$/;
		        const match = inputNodeId.match(regex);
		        if (!match) {
		            return { value: inputNodeId }; // string literal
		        }
		        const parts = match[1].split(".");
		        if (parts.length == 1) {
		            return { nodeId: parts[0] };
		        }
		        return { nodeId: parts[0], propIds: parts.slice(1) };
		    }
		    return { value: inputNodeId }; // non-string literal
		};
		exports.parseNodeName = parseNodeName;
		function assert(condition, message, isWarn = false) {
		    if (!condition) {
		        if (!isWarn) {
		            throw new Error(message);
		        }
		        console.warn("warn: " + message);
		    }
		}
		exports.assert = assert;
		const isObject = (x) => {
		    return x !== null && typeof x === "object";
		};
		exports.isObject = isObject;
		const getNestedData = (result, propId) => {
		    if (Array.isArray(result)) {
		        const regex = /^\$(\d+)$/;
		        const match = propId.match(regex);
		        if (match) {
		            const index = parseInt(match[1], 10);
		            return result[index];
		        }
		        if (propId === "$last") {
		            return result[result.length - 1];
		        }
		    }
		    else if ((0, exports.isObject)(result)) {
		        return result[propId];
		    }
		    return undefined;
		};
		const innerGetDataFromSource = (result, propIds) => {
		    if (result && propIds && propIds.length > 0) {
		        const propId = propIds[0];
		        const ret = getNestedData(result, propId);
		        if (propIds.length > 1) {
		            return innerGetDataFromSource(ret, propIds.slice(1));
		        }
		        return ret;
		    }
		    return result;
		};
		const getDataFromSource = (result, source) => {
		    if (!source.nodeId) {
		        return source.value;
		    }
		    return innerGetDataFromSource(result, source.propIds);
		};
		exports.getDataFromSource = getDataFromSource;
		exports.strIntentionalError = "Intentional Error for Debugging";
		exports.defaultAgentInfo = {
		    name: "defaultAgentInfo",
		    samples: [
		        {
		            inputs: [],
		            params: {},
		            result: {},
		        },
		    ],
		    description: "",
		    category: [],
		    author: "",
		    repository: "",
		    license: "",
		};
		const agentInfoWrapper = (agent) => {
		    return {
		        agent,
		        mock: agent,
		        ...exports.defaultAgentInfo,
		    };
		};
		exports.agentInfoWrapper = agentInfoWrapper;
		const objectToKeyArray = (innerData) => {
		    const ret = [];
		    Object.keys(innerData).forEach((key) => {
		        ret.push([key]);
		        if (Object.keys(innerData[key]).length > 0) {
		            objectToKeyArray(innerData[key]).forEach((tmp) => {
		                ret.push([key, ...tmp]);
		            });
		        }
		    });
		    return ret;
		};
		const debugResultKey = (agentId, result) => {
		    return objectToKeyArray({ [agentId]: debugResultKeyInner(result) }).map((objectKeys) => {
		        return ":" + objectKeys.join(".");
		    });
		};
		exports.debugResultKey = debugResultKey;
		const debugResultKeyInner = (result) => {
		    if (result === null || result === undefined) {
		        return {};
		    }
		    if (typeof result === "string") {
		        return {};
		    }
		    if (Array.isArray(result)) {
		        return Array.from(result.keys()).reduce((tmp, index) => {
		            tmp["$" + String(index)] = debugResultKeyInner(result[index]);
		            return tmp;
		        }, {});
		    }
		    return Object.keys(result).reduce((tmp, key) => {
		        tmp[key] = debugResultKeyInner(result[key]);
		        return tmp;
		    }, {});
		};
		const isLogicallyTrue = (value) => {
		    // Notice that empty aray is not true under GraphAI
		    if (Array.isArray(value) ? value.length === 0 : !value) {
		        return false;
		    }
		    return true;
		};
		exports.isLogicallyTrue = isLogicallyTrue;
		exports.defaultTestContext = {
		    debugInfo: {
		        nodeId: "test",
		        retry: 0,
		        verbose: true,
		    },
		    params: {},
		    filterParams: {},
		    agents: {},
		    log: [],
		}; 
	} (utils));

	var type = {};

	Object.defineProperty(type, "__esModule", { value: true });
	type.NodeState = void 0;
	var NodeState;
	(function (NodeState) {
	    NodeState["Waiting"] = "waiting";
	    NodeState["Queued"] = "queued";
	    NodeState["Executing"] = "executing";
	    NodeState["Failed"] = "failed";
	    NodeState["TimedOut"] = "timed-out";
	    NodeState["Completed"] = "completed";
	    NodeState["Injected"] = "injected";
	    NodeState["Skipped"] = "skipped";
	})(NodeState || (type.NodeState = NodeState = {}));

	var transaction_log = {};

	Object.defineProperty(transaction_log, "__esModule", { value: true });
	transaction_log.TransactionLog = void 0;
	const type_1$1 = type;
	const utils_1$4 = utils;
	class TransactionLog {
	    constructor(nodeId) {
	        this.nodeId = nodeId;
	        this.state = type_1$1.NodeState.Waiting;
	    }
	    initForComputedNode(node, graph) {
	        this.agentId = node.getAgentId();
	        this.params = node.params;
	        graph.appendLog(this);
	    }
	    onInjected(node, graph, injectFrom) {
	        const isUpdating = "endTime" in this;
	        this.result = node.result;
	        this.state = node.state;
	        this.endTime = Date.now();
	        this.injectFrom = injectFrom;
	        graph.setLoopLog(this);
	        // console.log(this)
	        if (isUpdating) {
	            graph.updateLog(this);
	        }
	        else {
	            graph.appendLog(this);
	        }
	    }
	    onComplete(node, graph, localLog) {
	        this.result = node.result;
	        this.resultKeys = (0, utils_1$4.debugResultKey)(this.agentId || "", node.result);
	        this.state = node.state;
	        this.endTime = Date.now();
	        graph.setLoopLog(this);
	        if (localLog.length > 0) {
	            this.log = localLog;
	        }
	        graph.updateLog(this);
	    }
	    beforeExecute(node, graph, transactionId, inputs) {
	        this.state = node.state;
	        this.retryCount = node.retryCount > 0 ? node.retryCount : undefined;
	        this.startTime = transactionId;
	        this.inputs = node.dataSources.filter((source) => source.nodeId).map((source) => source.nodeId);
	        this.inputsData = inputs.length > 0 ? inputs : undefined;
	        graph.setLoopLog(this);
	        graph.appendLog(this);
	    }
	    beforeAddTask(node, graph) {
	        this.state = node.state;
	        graph.setLoopLog(this);
	        graph.appendLog(this);
	    }
	    onError(node, graph, errorMessage) {
	        this.state = node.state;
	        this.errorMessage = errorMessage;
	        this.endTime = Date.now();
	        graph.setLoopLog(this);
	        graph.updateLog(this);
	    }
	    onSkipped(node, graph) {
	        this.state = node.state;
	        graph.setLoopLog(this);
	        graph.updateLog(this);
	    }
	}
	transaction_log.TransactionLog = TransactionLog;

	Object.defineProperty(node, "__esModule", { value: true });
	node.StaticNode = node.ComputedNode = node.Node = void 0;
	const utils_1$3 = utils;
	const type_1 = type;
	const utils_2 = utils;
	const transaction_log_1 = transaction_log;
	class Node {
	    constructor(nodeId, graph) {
	        this.waitlist = new Set(); // List of nodes which need data from this node.
	        this.state = type_1.NodeState.Waiting;
	        this.result = undefined;
	        this.nodeId = nodeId;
	        this.graph = graph;
	        this.log = new transaction_log_1.TransactionLog(nodeId);
	    }
	    asString() {
	        return `${this.nodeId}: ${this.state} ${[...this.waitlist]}`;
	    }
	    // This method is called either as the result of computation (computed node) or
	    // injection (static node).
	    onSetResult() {
	        this.waitlist.forEach((waitingNodeId) => {
	            const waitingNode = this.graph.nodes[waitingNodeId];
	            if (waitingNode.isComputedNode) {
	                waitingNode.removePending(this.nodeId);
	                this.graph.pushQueueIfReadyAndRunning(waitingNode);
	            }
	        });
	    }
	}
	node.Node = Node;
	class ComputedNode extends Node {
	    constructor(graphId, nodeId, data, graph) {
	        super(nodeId, graph);
	        this.retryCount = 0;
	        this.isStaticNode = false;
	        this.isComputedNode = true;
	        this.graphId = graphId;
	        this.params = data.params ?? {};
	        this.console = data.console ?? {};
	        this.filterParams = data.filterParams ?? {};
	        if (typeof data.agent === "string") {
	            this.agentId = data.agent;
	        }
	        else {
	            (0, utils_2.assert)(typeof data.agent === "function", "agent must be either string or function");
	            const agent = data.agent;
	            this.agentFunction = async ({ inputs }) => {
	                return agent(...inputs);
	            };
	        }
	        this.retryLimit = data.retry ?? graph.retryLimit ?? 0;
	        this.timeout = data.timeout;
	        this.isResult = data.isResult ?? false;
	        this.priority = data.priority ?? 0;
	        this.anyInput = data.anyInput ?? false;
	        this.dataSources = (data.inputs ?? []).map((input) => (0, utils_2.parseNodeName)(input, graph.version));
	        this.pendings = new Set(this.dataSources.filter((source) => source.nodeId).map((source) => source.nodeId));
	        if (typeof data.graph === "string") {
	            const source = (0, utils_2.parseNodeName)(data.graph, graph.version);
	            (0, utils_2.assert)(!!source.nodeId, `Invalid data source ${data.graph}`);
	            this.pendings.add(source.nodeId);
	            this.nestedGraph = source;
	        }
	        else if (data.graph) {
	            this.nestedGraph = data.graph;
	        }
	        if (data.if) {
	            this.ifSource = (0, utils_2.parseNodeName)(data.if, graph.version);
	            (0, utils_2.assert)(!!this.ifSource.nodeId, `Invalid data source ${data.if}`);
	            this.pendings.add(this.ifSource.nodeId);
	        }
	        if (data.unless) {
	            this.unlessSource = (0, utils_2.parseNodeName)(data.unless, graph.version);
	            (0, utils_2.assert)(!!this.unlessSource.nodeId, `Invalid data source ${data.unless}`);
	            this.pendings.add(this.unlessSource.nodeId);
	        }
	        this.dynamicParams = Object.keys(this.params).reduce((tmp, key) => {
	            const dataSource = (0, utils_2.parseNodeName)(this.params[key], graph.version < 0.3 ? 0.3 : graph.version);
	            if (dataSource.nodeId) {
	                (0, utils_2.assert)(!this.anyInput, "Dynamic params are not supported with anyInput");
	                tmp[key] = dataSource;
	                this.pendings.add(dataSource.nodeId);
	            }
	            return tmp;
	        }, {});
	        this.log.initForComputedNode(this, graph);
	    }
	    getAgentId() {
	        return this.agentId ?? "__custom__function"; // only for display purpose in the log.
	    }
	    isReadyNode() {
	        if (this.state === type_1.NodeState.Waiting && this.pendings.size === 0) {
	            // Count the number of data actually available.
	            // We care it only when this.anyInput is true.
	            // Notice that this logic enables dynamic data-flows.
	            const counter = this.dataSources.reduce((count, source) => {
	                const [result] = this.graph.resultsOf([source]);
	                return result === undefined ? count : count + 1;
	            }, 0);
	            if (!this.anyInput || counter > 0) {
	                if (this.ifSource) {
	                    const [condition] = this.graph.resultsOf([this.ifSource]);
	                    if (!(0, utils_2.isLogicallyTrue)(condition)) {
	                        this.state = type_1.NodeState.Skipped;
	                        this.log.onSkipped(this, this.graph);
	                        return false;
	                    }
	                }
	                if (this.unlessSource) {
	                    const [condition] = this.graph.resultsOf([this.unlessSource]);
	                    if ((0, utils_2.isLogicallyTrue)(condition)) {
	                        this.state = type_1.NodeState.Skipped;
	                        this.log.onSkipped(this, this.graph);
	                        return false;
	                    }
	                }
	                return true;
	            }
	        }
	        return false;
	    }
	    // This private method (only called while executing execute()) performs
	    // the "retry" if specified. The transaction log must be updated before
	    // callling this method.
	    retry(state, error) {
	        this.state = state; // this.execute() will update to NodeState.Executing
	        this.log.onError(this, this.graph, error.message);
	        if (this.retryCount < this.retryLimit) {
	            this.retryCount++;
	            this.execute();
	        }
	        else {
	            this.result = undefined;
	            this.error = error;
	            this.transactionId = undefined; // This is necessary for timeout case
	            this.graph.onExecutionComplete(this);
	        }
	    }
	    checkDataAvailability() {
	        (0, utils_2.assert)(this.anyInput, "checkDataAvailability should be called only for anyInput case");
	        const results = this.graph.resultsOf(this.dataSources).filter((result) => {
	            return result !== undefined;
	        });
	        return results.length > 0;
	    }
	    // This method is called right before the Graph add this node to the task manager.
	    beforeAddTask() {
	        this.state = type_1.NodeState.Queued;
	        this.log.beforeAddTask(this, this.graph);
	    }
	    // This method is called when the data became available on one of nodes,
	    // which this node needs data from.
	    removePending(nodeId) {
	        if (this.anyInput) {
	            if (this.checkDataAvailability()) {
	                this.pendings.clear();
	            }
	        }
	        else {
	            this.pendings.delete(nodeId);
	        }
	    }
	    isCurrentTransaction(transactionId) {
	        return this.transactionId === transactionId;
	    }
	    // This private method (called only fro execute) checks if the callback from
	    // the timer came before the completion of agent function call, record it
	    // and attempt to retry (if specified).
	    executeTimeout(transactionId) {
	        if (this.state === type_1.NodeState.Executing && this.isCurrentTransaction(transactionId)) {
	            console.warn(`-- timeout ${this.timeout} with ${this.nodeId}`);
	            this.retry(type_1.NodeState.TimedOut, Error("Timeout"));
	        }
	    }
	    // Check if we need to apply this filter to this node or not.
	    shouldApplyAgentFilter(agentFilter) {
	        if (agentFilter.agentIds && Array.isArray(agentFilter.agentIds) && agentFilter.agentIds.length > 0) {
	            if (this.agentId && agentFilter.agentIds.includes(this.agentId)) {
	                return true;
	            }
	        }
	        if (agentFilter.nodeIds && Array.isArray(agentFilter.nodeIds) && agentFilter.nodeIds.length > 0) {
	            if (agentFilter.nodeIds.includes(this.nodeId)) {
	                return true;
	            }
	        }
	        return !agentFilter.agentIds && !agentFilter.nodeIds;
	    }
	    agentFilterHandler(context, agentFunction) {
	        let index = 0;
	        const next = (innerContext) => {
	            const agentFilter = this.graph.agentFilters[index++];
	            if (agentFilter) {
	                if (this.shouldApplyAgentFilter(agentFilter)) {
	                    if (agentFilter.filterParams) {
	                        innerContext.filterParams = { ...agentFilter.filterParams, ...innerContext.filterParams };
	                    }
	                    return agentFilter.agent(innerContext, next);
	                }
	                return next(innerContext);
	            }
	            return agentFunction(innerContext);
	        };
	        return next(context);
	    }
	    // This method is called when this computed node became ready to run.
	    // It asynchronously calls the associated with agent function and set the result,
	    // then it removes itself from the "running node" list of the graph.
	    // Notice that setting the result of this node may make other nodes ready to run.
	    async execute() {
	        const previousResults = this.graph.resultsOf(this.dataSources).filter((result) => {
	            // Remove undefined if anyInput flag is set.
	            return !this.anyInput || result !== undefined;
	        });
	        const transactionId = Date.now();
	        this.prepareExecute(transactionId, previousResults);
	        if (this.timeout && this.timeout > 0) {
	            setTimeout(() => {
	                this.executeTimeout(transactionId);
	            }, this.timeout);
	        }
	        try {
	            const agentFunction = this.agentFunction ?? this.graph.getAgentFunctionInfo(this.agentId).agent;
	            const localLog = [];
	            const params = Object.keys(this.dynamicParams).reduce((tmp, key) => {
	                const [result] = this.graph.resultsOf([this.dynamicParams[key]]);
	                tmp[key] = result;
	                return tmp;
	            }, { ...this.params });
	            const context = {
	                params: params,
	                inputs: previousResults,
	                debugInfo: {
	                    nodeId: this.nodeId,
	                    agentId: this.agentId,
	                    retry: this.retryCount,
	                    verbose: this.graph.verbose,
	                },
	                filterParams: this.filterParams,
	                agentFilters: this.graph.agentFilters,
	                log: localLog,
	            };
	            // NOTE: We use the existence of graph object in the agent-specific params to determine
	            // if this is a nested agent or not.
	            if (this.nestedGraph) {
	                this.graph.taskManager.prepareForNesting();
	                context.taskManager = this.graph.taskManager;
	                if ("nodes" in this.nestedGraph) {
	                    context.graphData = this.nestedGraph;
	                }
	                else {
	                    const [graphData] = this.graph.resultsOf([this.nestedGraph]);
	                    context.graphData = graphData; // HACK: compiler work-around
	                }
	                context.agents = this.graph.agentFunctionInfoDictionary;
	            }
	            if (this.console.before) {
	                console.log(this.console.before === true ? JSON.stringify(context.inputs, null, 2) : this.console.before);
	            }
	            const result = await this.agentFilterHandler(context, agentFunction);
	            if (this.console.after) {
	                console.log(this.console.after === true ? (typeof result === "string" ? result : JSON.stringify(result, null, 2)) : this.console.after);
	            }
	            if (this.nestedGraph) {
	                this.graph.taskManager.restoreAfterNesting();
	            }
	            if (!this.isCurrentTransaction(transactionId)) {
	                // This condition happens when the agent function returns
	                // after the timeout (either retried or not).
	                console.log(`-- transactionId mismatch with ${this.nodeId} (probably timeout)`);
	                return;
	            }
	            this.state = type_1.NodeState.Completed;
	            this.result = result;
	            this.log.onComplete(this, this.graph, localLog);
	            this.onSetResult();
	            this.graph.onExecutionComplete(this);
	        }
	        catch (error) {
	            this.errorProcess(error, transactionId);
	        }
	    }
	    // This private method (called only by execute()) prepares the ComputedNode object
	    // for execution, and create a new transaction to record it.
	    prepareExecute(transactionId, inputs) {
	        this.state = type_1.NodeState.Executing;
	        this.log.beforeExecute(this, this.graph, transactionId, inputs);
	        this.transactionId = transactionId;
	    }
	    // This private method (called only by execute) processes an error received from
	    // the agent function. It records the error in the transaction log and handles
	    // the retry if specified.
	    errorProcess(error, transactionId) {
	        if (error instanceof Error && error.message !== utils_1$3.strIntentionalError) {
	            console.error(`<-- NodeId: ${this.nodeId}, Agent: ${this.agentId}`);
	            console.error(error);
	            console.error("-->");
	        }
	        if (!this.isCurrentTransaction(transactionId)) {
	            console.warn(`-- transactionId mismatch with ${this.nodeId} (not timeout)`);
	            return;
	        }
	        if (error instanceof Error) {
	            this.retry(type_1.NodeState.Failed, error);
	        }
	        else {
	            console.error(`-- NodeId: ${this.nodeId}: Unknown error was caught`);
	            this.retry(type_1.NodeState.Failed, Error("Unknown"));
	        }
	    }
	}
	node.ComputedNode = ComputedNode;
	class StaticNode extends Node {
	    constructor(nodeId, data, graph) {
	        super(nodeId, graph);
	        this.isStaticNode = true;
	        this.isComputedNode = false;
	        this.value = data.value;
	        this.update = data.update ? (0, utils_2.parseNodeName)(data.update, graph.version) : undefined;
	        this.isResult = data.isResult ?? false;
	    }
	    injectValue(value, injectFrom) {
	        this.state = type_1.NodeState.Injected;
	        this.result = value;
	        this.log.onInjected(this, this.graph, injectFrom);
	        this.onSetResult();
	    }
	}
	node.StaticNode = StaticNode;

	var validator = {};

	var graph_data_validator = {};

	var common = {};

	Object.defineProperty(common, "__esModule", { value: true });
	common.ValidationError = common.staticNodeAttributeKeys = common.computedNodeAttributeKeys = common.graphDataAttributeKeys = void 0;
	common.graphDataAttributeKeys = ["nodes", "concurrency", "agentId", "loop", "verbose", "version"];
	common.computedNodeAttributeKeys = [
	    "inputs",
	    "anyInput",
	    "params",
	    "retry",
	    "timeout",
	    "agent",
	    "graph",
	    "isResult",
	    "priority",
	    "if",
	    "unless",
	    "filterParams",
	    "console",
	];
	common.staticNodeAttributeKeys = ["value", "update", "isResult"];
	class ValidationError extends Error {
	    constructor(message) {
	        super(`\x1b[41m${message}\x1b[0m`); // Pass the message to the base Error class
	        // Set the prototype explicitly to ensure correct prototype chain
	        Object.setPrototypeOf(this, ValidationError.prototype);
	    }
	}
	common.ValidationError = ValidationError;

	Object.defineProperty(graph_data_validator, "__esModule", { value: true });
	graph_data_validator.graphDataValidator = graph_data_validator.graphNodesValidator = void 0;
	const common_1$5 = common;
	const graphNodesValidator = (data) => {
	    if (data.nodes === undefined) {
	        throw new common_1$5.ValidationError("Invalid Graph Data: no nodes");
	    }
	    if (typeof data.nodes !== "object") {
	        throw new common_1$5.ValidationError("Invalid Graph Data: invalid nodes");
	    }
	    if (Array.isArray(data.nodes)) {
	        throw new common_1$5.ValidationError("Invalid Graph Data: nodes must be object");
	    }
	    if (Object.keys(data.nodes).length === 0) {
	        throw new common_1$5.ValidationError("Invalid Graph Data: nodes is empty");
	    }
	    Object.keys(data).forEach((key) => {
	        if (!common_1$5.graphDataAttributeKeys.includes(key)) {
	            throw new common_1$5.ValidationError("Graph Data does not allow " + key);
	        }
	    });
	};
	graph_data_validator.graphNodesValidator = graphNodesValidator;
	const graphDataValidator = (data) => {
	    if (data.loop) {
	        if (data.loop.count === undefined && data.loop.while === undefined) {
	            throw new common_1$5.ValidationError("Loop: Either count or while is required in loop");
	        }
	        if (data.loop.count !== undefined && data.loop.while !== undefined) {
	            throw new common_1$5.ValidationError("Loop: Both count and while cannot be set");
	        }
	    }
	    if (data.concurrency !== undefined) {
	        if (!Number.isInteger(data.concurrency)) {
	            throw new common_1$5.ValidationError("Concurrency must be an integer");
	        }
	        if (data.concurrency < 1) {
	            throw new common_1$5.ValidationError("Concurrency must be a positive integer");
	        }
	    }
	};
	graph_data_validator.graphDataValidator = graphDataValidator;

	var nodeValidator$1 = {};

	Object.defineProperty(nodeValidator$1, "__esModule", { value: true });
	nodeValidator$1.nodeValidator = void 0;
	const common_1$4 = common;
	const nodeValidator = (nodeData) => {
	    if (nodeData.agent && nodeData.value) {
	        throw new common_1$4.ValidationError("Cannot set both agent and value");
	    }
	    if (!("agent" in nodeData) && !("value" in nodeData)) {
	        throw new common_1$4.ValidationError("Either agent or value is required");
	    }
	    return true;
	};
	nodeValidator$1.nodeValidator = nodeValidator;

	var static_node_validator = {};

	Object.defineProperty(static_node_validator, "__esModule", { value: true });
	static_node_validator.staticNodeValidator = void 0;
	const common_1$3 = common;
	const staticNodeValidator = (nodeData) => {
	    Object.keys(nodeData).forEach((key) => {
	        if (!common_1$3.staticNodeAttributeKeys.includes(key)) {
	            throw new common_1$3.ValidationError("Static node does not allow " + key);
	        }
	    });
	    return true;
	};
	static_node_validator.staticNodeValidator = staticNodeValidator;

	var computed_node_validator = {};

	Object.defineProperty(computed_node_validator, "__esModule", { value: true });
	computed_node_validator.computedNodeValidator = void 0;
	const common_1$2 = common;
	const computedNodeValidator = (nodeData) => {
	    Object.keys(nodeData).forEach((key) => {
	        if (!common_1$2.computedNodeAttributeKeys.includes(key)) {
	            throw new common_1$2.ValidationError("Computed node does not allow " + key);
	        }
	    });
	    return true;
	};
	computed_node_validator.computedNodeValidator = computedNodeValidator;

	var relation_validator = {};

	Object.defineProperty(relation_validator, "__esModule", { value: true });
	relation_validator.relationValidator = void 0;
	const utils_1$2 = utils;
	const common_1$1 = common;
	const relationValidator = (data, staticNodeIds, computedNodeIds) => {
	    const nodeIds = new Set(Object.keys(data.nodes));
	    const pendings = {};
	    const waitlist = {};
	    // validate input relation and set pendings and wait list
	    computedNodeIds.forEach((computedNodeId) => {
	        const nodeData = data.nodes[computedNodeId];
	        pendings[computedNodeId] = new Set();
	        if ("inputs" in nodeData && nodeData && nodeData.inputs) {
	            nodeData.inputs.forEach((inputNodeId) => {
	                const sourceNodeId = (0, utils_1$2.parseNodeName)(inputNodeId, data.version ?? 0.02).nodeId;
	                if (sourceNodeId) {
	                    if (!nodeIds.has(sourceNodeId)) {
	                        throw new common_1$1.ValidationError(`Inputs not match: NodeId ${computedNodeId}, Inputs: ${sourceNodeId}`);
	                    }
	                    waitlist[sourceNodeId] === undefined && (waitlist[sourceNodeId] = new Set());
	                    pendings[computedNodeId].add(sourceNodeId);
	                    waitlist[sourceNodeId].add(computedNodeId);
	                }
	            });
	        }
	    });
	    // TODO. validate update
	    staticNodeIds.forEach((staticNodeId) => {
	        const nodeData = data.nodes[staticNodeId];
	        if ("value" in nodeData && nodeData.update) {
	            const update = nodeData.update;
	            const updateNodeId = (0, utils_1$2.parseNodeName)(update, data.version ?? 0.02).nodeId;
	            if (!updateNodeId) {
	                throw new common_1$1.ValidationError("Update it a literal");
	            }
	            if (!nodeIds.has(updateNodeId)) {
	                throw new common_1$1.ValidationError(`Update not match: NodeId ${staticNodeId}, update: ${update}`);
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
	        throw new common_1$1.ValidationError("No Initial Runnning Node");
	    }
	    do {
	        runningQueue = cycle(runningQueue);
	    } while (runningQueue.length > 0);
	    if (Object.keys(pendings).length > 0) {
	        throw new common_1$1.ValidationError("Some nodes are not executed: " + Object.keys(pendings).join(", "));
	    }
	};
	relation_validator.relationValidator = relationValidator;

	var agent_validator = {};

	Object.defineProperty(agent_validator, "__esModule", { value: true });
	agent_validator.agentValidator = void 0;
	const common_1 = common;
	const agentValidator = (graphAgentIds, agentIds) => {
	    graphAgentIds.forEach((agentId) => {
	        if (!agentIds.has(agentId)) {
	            throw new common_1.ValidationError("Invalid Agent : " + agentId + " is not in AgentFunctionInfoDictionary.");
	        }
	    });
	    return true;
	};
	agent_validator.agentValidator = agentValidator;

	Object.defineProperty(validator, "__esModule", { value: true });
	validator.validateGraphData = void 0;
	const graph_data_validator_1 = graph_data_validator;
	const nodeValidator_1 = nodeValidator$1;
	const static_node_validator_1 = static_node_validator;
	const computed_node_validator_1 = computed_node_validator;
	const relation_validator_1 = relation_validator;
	const agent_validator_1 = agent_validator;
	const validateGraphData = (data, agentIds) => {
	    (0, graph_data_validator_1.graphNodesValidator)(data);
	    (0, graph_data_validator_1.graphDataValidator)(data);
	    const computedNodeIds = [];
	    const staticNodeIds = [];
	    const graphAgentIds = new Set();
	    Object.keys(data.nodes).forEach((nodeId) => {
	        const node = data.nodes[nodeId];
	        const isStaticNode = "value" in node;
	        (0, nodeValidator_1.nodeValidator)(node);
	        const agentId = isStaticNode ? "" : node.agent;
	        isStaticNode && (0, static_node_validator_1.staticNodeValidator)(node) && staticNodeIds.push(nodeId);
	        !isStaticNode && (0, computed_node_validator_1.computedNodeValidator)(node) && computedNodeIds.push(nodeId) && typeof agentId === "string" && graphAgentIds.add(agentId);
	    });
	    (0, agent_validator_1.agentValidator)(graphAgentIds, new Set(agentIds));
	    (0, relation_validator_1.relationValidator)(data, staticNodeIds, computedNodeIds);
	    return true;
	};
	validator.validateGraphData = validateGraphData;

	var task_manager = {};

	Object.defineProperty(task_manager, "__esModule", { value: true });
	task_manager.TaskManager = void 0;
	const utils_1$1 = utils;
	// TaskManage object controls the concurrency of ComputedNode execution.
	//
	// NOTE: A TaskManager instance will be shared between parent graph and its children
	// when nested agents are involved.
	class TaskManager {
	    constructor(concurrency) {
	        this.taskQueue = [];
	        this.runningNodes = new Set();
	        this.concurrency = concurrency;
	    }
	    // This internal method dequeus a task from the task queue
	    // and call the associated callback method, if the number of
	    // running task is lower than the spcified limit.
	    dequeueTaskIfPossible() {
	        if (this.runningNodes.size < this.concurrency) {
	            const task = this.taskQueue.shift();
	            if (task) {
	                this.runningNodes.add(task.node);
	                task.callback(task.node);
	            }
	        }
	    }
	    // Node will call this method to put itself in the execution queue.
	    // We call the associated callback function when it is dequeued.
	    addTask(node, graphId, callback) {
	        // Finder tasks in the queue, which has either the same or higher priority.
	        const count = this.taskQueue.filter((task) => {
	            return task.node.priority >= node.priority;
	        }).length;
	        (0, utils_1$1.assert)(count <= this.taskQueue.length, "TaskManager.addTask: Something is really wrong.");
	        this.taskQueue.splice(count, 0, { node, graphId, callback });
	        this.dequeueTaskIfPossible();
	    }
	    isRunning(graphId) {
	        const count = [...this.runningNodes].filter((node) => {
	            return node.graphId == graphId;
	        }).length;
	        return count > 0 || Array.from(this.taskQueue).filter((data) => data.graphId === graphId).length > 0;
	    }
	    // Node MUST call this method once the execution of agent function is completed
	    // either successfully or not.
	    onComplete(node) {
	        (0, utils_1$1.assert)(this.runningNodes.has(node), `TaskManager.onComplete node(${node.nodeId}) is not in list`);
	        this.runningNodes.delete(node);
	        this.dequeueTaskIfPossible();
	    }
	    // Node will call this method before it hands the task manager from the graph
	    // to a nested agent. We need to make it sure that there is enough room to run
	    // computed nodes inside the nested graph to avoid a deadlock.
	    prepareForNesting() {
	        this.concurrency++;
	    }
	    restoreAfterNesting() {
	        this.concurrency--;
	    }
	    getStatus(verbose = false) {
	        const runningNodes = Array.from(this.runningNodes).map((node) => node.nodeId);
	        const queuedNodes = this.taskQueue.map((task) => task.node.nodeId);
	        const nodes = verbose ? { runningNodes, queuedNodes } : {};
	        return {
	            concurrency: this.concurrency,
	            queue: this.taskQueue.length,
	            running: this.runningNodes.size,
	            ...nodes,
	        };
	    }
	}
	task_manager.TaskManager = TaskManager;

	Object.defineProperty(graphai, "__esModule", { value: true });
	graphai.GraphAI = void 0;
	const node_1 = node;
	const utils_1 = utils;
	const validator_1 = validator;
	const task_manager_1 = task_manager;
	const defaultConcurrency = 8;
	const latestVersion = 0.3;
	class GraphAI {
	    // This method is called when either the GraphAI obect was created,
	    // or we are about to start n-th iteration (n>2).
	    createNodes(data) {
	        const nodes = Object.keys(data.nodes).reduce((_nodes, nodeId) => {
	            const nodeData = data.nodes[nodeId];
	            if ("value" in nodeData) {
	                _nodes[nodeId] = new node_1.StaticNode(nodeId, nodeData, this);
	            }
	            else if ("agent" in nodeData) {
	                _nodes[nodeId] = new node_1.ComputedNode(this.graphId, nodeId, nodeData, this);
	            }
	            else {
	                throw new Error("Unknown node type (neither value nor agent): " + nodeId);
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
	        return (0, utils_1.getDataFromSource)(source.nodeId ? results[source.nodeId] : undefined, source);
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
	                if (value) {
	                    this.injectValue(nodeId, value, nodeId);
	                }
	                const update = node?.update;
	                if (update && previousResults) {
	                    const result = this.getValueFromResults(update, previousResults);
	                    this.injectValue(nodeId, result, update.nodeId);
	                }
	            }
	        });
	    }
	    constructor(data, agentFunctionInfoDictionary, options = {
	        taskManager: undefined,
	        agentFilters: [],
	        bypassAgentIds: [],
	    }) {
	        this.logs = [];
	        this.onLogCallback = (__log, __isUpdate) => { };
	        this.repeatCount = 0;
	        if (!data.version && !options.taskManager) {
	            console.warn("------------ missing version number");
	        }
	        this.version = data.version ?? latestVersion;
	        if (this.version < latestVersion) {
	            console.warn(`------------ upgrade to ${latestVersion}!`);
	        }
	        this.retryLimit = data.retry; // optional
	        this.graphId = URL.createObjectURL(new Blob()).slice(-36);
	        this.data = data;
	        this.agentFunctionInfoDictionary = agentFunctionInfoDictionary;
	        this.taskManager = options.taskManager ?? new task_manager_1.TaskManager(data.concurrency ?? defaultConcurrency);
	        this.agentFilters = options.agentFilters ?? [];
	        this.bypassAgentIds = options.bypassAgentIds ?? [];
	        this.loop = data.loop;
	        this.verbose = data.verbose === true;
	        this.onComplete = () => {
	            throw new Error("SOMETHING IS WRONG: onComplete is called without run()");
	        };
	        (0, validator_1.validateGraphData)(data, [...Object.keys(agentFunctionInfoDictionary), ...this.bypassAgentIds]);
	        this.nodes = this.createNodes(data);
	        this.initializeNodes();
	    }
	    getAgentFunctionInfo(agentId) {
	        if (agentId && this.agentFunctionInfoDictionary[agentId]) {
	            return this.agentFunctionInfoDictionary[agentId];
	        }
	        if (agentId && this.bypassAgentIds.includes(agentId)) {
	            return {
	                agent: async () => {
	                    return null;
	                },
	            };
	        }
	        // We are not supposed to hit this error because the validator will catch it.
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
	        node.beforeAddTask();
	        this.taskManager.addTask(node, this.graphId, (_node) => {
	            (0, utils_1.assert)(node.nodeId === _node.nodeId, "GraphAI.pushQueue node mismatch");
	            node.execute();
	        });
	    }
	    // Public API
	    async run(all = false) {
	        if (this.isRunning()) {
	            throw new Error("This GraphUI instance is already running");
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
	                const source = (0, utils_1.parseNodeName)(loop.while, this.version);
	                const value = this.getValueFromResults(source, this.results(true));
	                // NOTE: We treat an empty array as false.
	                if (!(0, utils_1.isLogicallyTrue)(value)) {
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
	            throw new Error(`injectValue with Invalid nodeId, ${nodeId}`);
	        }
	    }
	    resultsOf(sources) {
	        return sources.map((source) => {
	            const { result } = source.nodeId ? this.nodes[source.nodeId] : { result: undefined };
	            return (0, utils_1.getDataFromSource)(result, source);
	        });
	    }
	}
	graphai.GraphAI = GraphAI;

	var runner = {};

	Object.defineProperty(runner, "__esModule", { value: true });
	runner.agentFilterRunnerBuilder = void 0;
	// for test and server.
	const agentFilterRunnerBuilder = (__agentFilters) => {
	    const agentFilters = __agentFilters;
	    const agentFilterRunner = (context, agent) => {
	        let index = 0;
	        const next = (context) => {
	            const agentFilter = agentFilters[index++];
	            if (agentFilter) {
	                return agentFilter.agent(context, next);
	            }
	            return agent(context);
	        };
	        return next(context);
	    };
	    return agentFilterRunner;
	};
	runner.agentFilterRunnerBuilder = agentFilterRunnerBuilder;

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.ValidationError = exports.strIntentionalError = exports.defaultTestContext = exports.agentInfoWrapper = exports.defaultAgentInfo = exports.agentFilterRunnerBuilder = exports.NodeState = exports.GraphAI = void 0;
		var graphai_1 = graphai;
		Object.defineProperty(exports, "GraphAI", { enumerable: true, get: function () { return graphai_1.GraphAI; } });
		var type_1 = type;
		Object.defineProperty(exports, "NodeState", { enumerable: true, get: function () { return type_1.NodeState; } });
		var runner_1 = runner;
		Object.defineProperty(exports, "agentFilterRunnerBuilder", { enumerable: true, get: function () { return runner_1.agentFilterRunnerBuilder; } });
		var utils_1 = utils;
		Object.defineProperty(exports, "defaultAgentInfo", { enumerable: true, get: function () { return utils_1.defaultAgentInfo; } });
		Object.defineProperty(exports, "agentInfoWrapper", { enumerable: true, get: function () { return utils_1.agentInfoWrapper; } });
		Object.defineProperty(exports, "defaultTestContext", { enumerable: true, get: function () { return utils_1.defaultTestContext; } });
		Object.defineProperty(exports, "strIntentionalError", { enumerable: true, get: function () { return utils_1.strIntentionalError; } });
		var common_1 = common;
		Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function () { return common_1.ValidationError; } }); 
	} (lib));

	var index = /*@__PURE__*/getDefaultExportFromCjs(lib);

	return index;

}));
