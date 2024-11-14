const sleep = async (milliseconds) => {
    return await new Promise((resolve) => setTimeout(resolve, milliseconds));
};
const parseNodeName = (inputNodeId) => {
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
function assert(condition, message, isWarn = false) {
    if (!condition) {
        if (!isWarn) {
            throw new Error(message);
        }
        console.warn("warn: " + message);
    }
}
const isObject = (x) => {
    return x !== null && typeof x === "object";
};
const isNull = (data) => {
    return data === null || data === undefined;
};
const strIntentionalError = "Intentional Error for Debugging";
const defaultAgentInfo = {
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
        ...defaultAgentInfo,
    };
};
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
const defaultTestContext = {
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
const isNamedInputs = (namedInputs) => {
    return isObject(namedInputs) && !Array.isArray(namedInputs) && Object.keys(namedInputs || {}).length > 0;
};

// for dataSource
const inputs2dataSources = (inputs) => {
    if (Array.isArray(inputs)) {
        return inputs.map((inp) => inputs2dataSources(inp)).flat();
    }
    if (isObject(inputs)) {
        return Object.values(inputs)
            .map((input) => inputs2dataSources(input))
            .flat();
    }
    if (typeof inputs === "string") {
        const templateMatch = [...inputs.matchAll(/\${(:[^}]+)}/g)].map((m) => m[1]);
        if (templateMatch.length > 0) {
            return inputs2dataSources(templateMatch);
        }
    }
    return parseNodeName(inputs);
};
const dataSourceNodeIds = (sources) => {
    return sources.filter((source) => source.nodeId).map((source) => source.nodeId);
};

var NodeState;
(function (NodeState) {
    NodeState["Waiting"] = "waiting";
    NodeState["Queued"] = "queued";
    NodeState["Executing"] = "executing";
    NodeState["ExecutingServer"] = "executing-server";
    NodeState["Failed"] = "failed";
    NodeState["TimedOut"] = "timed-out";
    NodeState["Completed"] = "completed";
    NodeState["Injected"] = "injected";
    NodeState["Skipped"] = "skipped";
})(NodeState || (NodeState = {}));

class TransactionLog {
    constructor(nodeId) {
        this.nodeId = nodeId;
        this.state = NodeState.Waiting;
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
        this.resultKeys = debugResultKey(this.agentId || "", node.result);
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
        this.inputs = dataSourceNodeIds(node.dataSources);
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

class Node {
    constructor(nodeId, graph) {
        this.waitlist = new Set(); // List of nodes which need data from this node.
        this.state = NodeState.Waiting;
        this.result = undefined;
        this.nodeId = nodeId;
        this.graph = graph;
        this.log = new TransactionLog(nodeId);
        this.console = {};
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
    afterConsoleLog(result) {
        if (this.console.after === true) {
            console.log(typeof result === "string" ? result : JSON.stringify(result, null, 2));
        }
        else if (this.console.after) {
            console.log(this.console.after);
        }
    }
}
class ComputedNode extends Node {
    constructor(graphId, nodeId, data, graph) {
        super(nodeId, graph);
        this.retryCount = 0;
        this.dataSources = []; // no longer needed. This is for transaction log.
        this.isNamedInputs = false;
        this.isStaticNode = false;
        this.isComputedNode = true;
        this.graphId = graphId;
        this.params = data.params ?? {};
        this.console = data.console ?? {};
        this.filterParams = data.filterParams ?? {};
        this.passThrough = data.passThrough;
        this.retryLimit = data.retry ?? graph.retryLimit ?? 0;
        this.timeout = data.timeout;
        this.isResult = data.isResult ?? false;
        this.priority = data.priority ?? 0;
        this.anyInput = data.anyInput ?? false;
        this.inputs = data.inputs;
        this.isNamedInputs = isObject(data.inputs) && !Array.isArray(data.inputs);
        this.dataSources = data.inputs ? inputs2dataSources(data.inputs).flat(10) : [];
        if (data.inputs && !this.isNamedInputs) {
            console.warn(`array inputs have been deprecated. nodeId: ${nodeId}: see https://github.com/receptron/graphai/blob/main/docs/NamedInputs.md`);
        }
        this.pendings = new Set(dataSourceNodeIds(this.dataSources));
        assert(["function", "string"].includes(typeof data.agent), "agent must be either string or function");
        if (typeof data.agent === "string") {
            this.agentId = data.agent;
        }
        else {
            const agent = data.agent;
            this.agentFunction = this.isNamedInputs ? async ({ namedInputs }) => agent(namedInputs) : async ({ inputs }) => agent(...inputs);
        }
        if (data.graph) {
            this.nestedGraph = typeof data.graph === "string" ? this.addPendingNode(data.graph) : data.graph;
        }
        if (data.graphLoader && graph.graphLoader) {
            this.nestedGraph = graph.graphLoader(data.graphLoader);
        }
        if (data.if) {
            this.ifSource = this.addPendingNode(data.if);
        }
        if (data.unless) {
            this.unlessSource = this.addPendingNode(data.unless);
        }
        this.dynamicParams = Object.keys(this.params).reduce((tmp, key) => {
            const dataSource = parseNodeName(this.params[key]);
            if (dataSource.nodeId) {
                assert(!this.anyInput, "Dynamic params are not supported with anyInput");
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
    addPendingNode(nodeId) {
        const source = parseNodeName(nodeId);
        assert(!!source.nodeId, `Invalid data source ${nodeId}`);
        this.pendings.add(source.nodeId);
        return source;
    }
    isReadyNode() {
        if (this.state !== NodeState.Waiting || this.pendings.size !== 0) {
            return false;
        }
        if ((this.ifSource && !isLogicallyTrue(this.graph.resultOf(this.ifSource))) ||
            (this.unlessSource && isLogicallyTrue(this.graph.resultOf(this.unlessSource)))) {
            this.state = NodeState.Skipped;
            this.log.onSkipped(this, this.graph);
            return false;
        }
        return true;
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
        return Object.values(this.graph.resultsOf(this.inputs))
            .flat()
            .some((result) => result !== undefined);
    }
    // This method is called right before the Graph add this node to the task manager.
    beforeAddTask() {
        this.state = NodeState.Queued;
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
        if (this.state === NodeState.Executing && this.isCurrentTransaction(transactionId)) {
            console.warn(`-- timeout ${this.timeout} with ${this.nodeId}`);
            this.retry(NodeState.TimedOut, Error("Timeout"));
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
        const previousResults = this.graph.resultsOf(this.inputs, this.anyInput);
        const transactionId = Date.now();
        this.prepareExecute(transactionId, Object.values(previousResults));
        if (this.timeout && this.timeout > 0) {
            setTimeout(() => {
                this.executeTimeout(transactionId);
            }, this.timeout);
        }
        try {
            const agentFunction = this.agentFunction ?? this.graph.getAgentFunctionInfo(this.agentId).agent;
            const localLog = [];
            const context = this.getContext(previousResults, localLog);
            // NOTE: We use the existence of graph object in the agent-specific params to determine
            // if this is a nested agent or not.
            if (this.nestedGraph) {
                this.graph.taskManager.prepareForNesting();
                context.taskManager = this.graph.taskManager;
                context.onLogCallback = this.graph.onLogCallback;
                if ("nodes" in this.nestedGraph) {
                    context.graphData = this.nestedGraph;
                }
                else {
                    context.graphData = this.graph.resultOf(this.nestedGraph); // HACK: compiler work-around
                }
                context.agents = this.graph.agentFunctionInfoDictionary;
            }
            this.beforeConsoleLog(context);
            const result = await this.agentFilterHandler(context, agentFunction);
            this.afterConsoleLog(result);
            if (this.nestedGraph) {
                this.graph.taskManager.restoreAfterNesting();
            }
            if (!this.isCurrentTransaction(transactionId)) {
                // This condition happens when the agent function returns
                // after the timeout (either retried or not).
                console.log(`-- transactionId mismatch with ${this.nodeId} (probably timeout)`);
                return;
            }
            this.state = NodeState.Completed;
            this.result = this.getResult(result);
            this.log.onComplete(this, this.graph, localLog);
            this.onSetResult();
            this.graph.onExecutionComplete(this);
        }
        catch (error) {
            this.errorProcess(error, transactionId, previousResults);
        }
    }
    // This private method (called only by execute()) prepares the ComputedNode object
    // for execution, and create a new transaction to record it.
    prepareExecute(transactionId, inputs) {
        this.state = NodeState.Executing;
        this.log.beforeExecute(this, this.graph, transactionId, inputs);
        this.transactionId = transactionId;
    }
    // This private method (called only by execute) processes an error received from
    // the agent function. It records the error in the transaction log and handles
    // the retry if specified.
    errorProcess(error, transactionId, namedInputs) {
        if (error instanceof Error && error.message !== strIntentionalError) {
            console.error(`<-- NodeId: ${this.nodeId}, Agent: ${this.agentId}`);
            console.error({ namedInputs });
            console.error(error);
            console.error("-->");
        }
        if (!this.isCurrentTransaction(transactionId)) {
            console.warn(`-- transactionId mismatch with ${this.nodeId} (not timeout)`);
            return;
        }
        if (error instanceof Error) {
            this.retry(NodeState.Failed, error);
        }
        else {
            console.error(`-- NodeId: ${this.nodeId}: Unknown error was caught`);
            this.retry(NodeState.Failed, Error("Unknown"));
        }
    }
    getParams() {
        return Object.keys(this.dynamicParams).reduce((tmp, key) => {
            const result = this.graph.resultOf(this.dynamicParams[key]);
            tmp[key] = result;
            return tmp;
        }, { ...this.params });
    }
    getInputs(previousResults) {
        if (Array.isArray(this.inputs)) {
            return (this.inputs ?? []).map((key) => previousResults[String(key)]).filter((a) => !this.anyInput || a);
        }
        return [];
    }
    getContext(previousResults, localLog) {
        const context = {
            params: this.getParams(),
            inputs: this.getInputs(previousResults),
            namedInputs: this.isNamedInputs ? previousResults : {},
            inputSchema: this.agentFunction ? undefined : this.graph.getAgentFunctionInfo(this.agentId)?.inputs,
            debugInfo: this.getDebugInfo(),
            filterParams: this.filterParams,
            agentFilters: this.graph.agentFilters,
            config: this.graph.config,
            log: localLog,
        };
        return context;
    }
    getResult(result) {
        if (result && this.passThrough) {
            if (isObject(result) && !Array.isArray(result)) {
                return { ...result, ...this.passThrough };
            }
            else if (Array.isArray(result)) {
                return result.map((r) => (isObject(r) && !Array.isArray(r) ? { ...r, ...this.passThrough } : r));
            }
        }
        return result;
    }
    getDebugInfo() {
        return {
            nodeId: this.nodeId,
            agentId: this.agentId,
            retry: this.retryCount,
            verbose: this.graph.verbose,
            version: this.graph.version,
            isResult: this.isResult,
        };
    }
    beforeConsoleLog(context) {
        if (this.console.before === true) {
            console.log(JSON.stringify(this.isNamedInputs ? context.namedInputs : context.inputs, null, 2));
        }
        else if (this.console.before) {
            console.log(this.console.before);
        }
    }
}
class StaticNode extends Node {
    constructor(nodeId, data, graph) {
        super(nodeId, graph);
        this.isStaticNode = true;
        this.isComputedNode = false;
        this.value = data.value;
        this.update = data.update ? parseNodeName(data.update) : undefined;
        this.isResult = data.isResult ?? false;
        this.console = data.console ?? {};
    }
    injectValue(value, injectFrom) {
        this.state = NodeState.Injected;
        this.result = value;
        this.log.onInjected(this, this.graph, injectFrom);
        this.onSetResult();
    }
    consoleLog() {
        this.afterConsoleLog(this.result);
    }
}

const propFunctionRegex = /^[a-zA-Z]+\([^)]*\)$/;
const propArrayFunction = (result, propId) => {
    if (Array.isArray(result)) {
        if (propId === "length()") {
            return result.length;
        }
        if (propId === "flat()") {
            return result.flat();
        }
        if (propId === "toJSON()") {
            return JSON.stringify(result);
        }
        if (propId === "isEmpty()") {
            return result.length === 0;
        }
        // array join
        const matchJoin = propId.match(/^join\(([,-]?)\)$/);
        if (matchJoin && Array.isArray(matchJoin)) {
            return result.join(matchJoin[1] ?? "");
        }
    }
    return undefined;
};
const propObjectFunction = (result, propId) => {
    if (isObject(result)) {
        if (propId === "keys()") {
            return Object.keys(result);
        }
        if (propId === "values()") {
            return Object.values(result);
        }
        if (propId === "toJSON()") {
            return JSON.stringify(result);
        }
    }
    return undefined;
};
const propStringFunction = (result, propId) => {
    if (typeof result === "string") {
        if (propId === "codeBlock()") {
            const match = ("\n" + result).match(/\n```[a-zA-z]*([\s\S]*?)\n```/);
            if (match) {
                return match[1];
            }
        }
        if (propId === "jsonParse()") {
            return JSON.parse(result);
        }
        if (propId === "toNumber()") {
            const ret = Number(result);
            if (!isNaN(ret)) {
                return ret;
            }
        }
    }
    return undefined;
};
const propNumberFunction = (result, propId) => {
    if (result !== undefined && Number.isFinite(result)) {
        if (propId === "toString()") {
            return String(result);
        }
        const regex = /^add\((-?\d+)\)$/;
        const match = propId.match(regex);
        if (match) {
            return Number(result) + Number(match[1]);
        }
    }
    return undefined;
};
const propBooleanFunction = (result, propId) => {
    if (typeof result === "boolean") {
        if (propId === "not()") {
            return !result;
        }
    }
    return undefined;
};
const propFunctions = [propArrayFunction, propObjectFunction, propStringFunction, propNumberFunction, propBooleanFunction];

const getNestedData = (result, propId, propFunctions) => {
    const match = propId.match(propFunctionRegex);
    if (match) {
        for (const propFunction of propFunctions) {
            const ret = propFunction(result, propId);
            if (!isNull(ret)) {
                return ret;
            }
        }
    }
    // for array.
    if (Array.isArray(result)) {
        // $0, $1. array value.
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
    else if (isObject(result)) {
        if (propId in result) {
            return result[propId];
        }
    }
    return undefined;
};
const innerGetDataFromSource = (result, propIds, propFunctions) => {
    if (!isNull(result) && propIds && propIds.length > 0) {
        const propId = propIds[0];
        const ret = getNestedData(result, propId, propFunctions);
        if (ret === undefined) {
            console.error(`prop: ${propIds.join(".")} is not hit`);
        }
        if (propIds.length > 1) {
            return innerGetDataFromSource(ret, propIds.slice(1), propFunctions);
        }
        return ret;
    }
    return result;
};
const getDataFromSource = (result, source, propFunctions = []) => {
    if (!source.nodeId) {
        return source.value;
    }
    return innerGetDataFromSource(result, source.propIds, propFunctions);
};

const resultsOfInner = (input, nodes, propFunctions) => {
    if (Array.isArray(input)) {
        return input.map((inp) => resultsOfInner(inp, nodes, propFunctions));
    }
    if (isNamedInputs(input)) {
        return resultsOf(input, nodes, propFunctions);
    }
    if (typeof input === "string") {
        const templateMatch = [...input.matchAll(/\${(:[^}]+)}/g)].map((m) => m[1]);
        if (templateMatch.length > 0) {
            const results = resultsOfInner(templateMatch, nodes, propFunctions);
            return Array.from(templateMatch.keys()).reduce((tmp, key) => {
                return tmp.replaceAll("${" + templateMatch[key] + "}", results[key]);
            }, input);
        }
    }
    return resultOf(parseNodeName(input), nodes, propFunctions);
};
const resultsOf = (inputs, nodes, propFunctions) => {
    // for inputs. TODO remove if array input is not supported
    if (Array.isArray(inputs)) {
        return inputs.reduce((tmp, key) => {
            tmp[key] = resultsOfInner(key, nodes, propFunctions);
            return tmp;
        }, {});
    }
    return Object.keys(inputs).reduce((tmp, key) => {
        const input = inputs[key];
        tmp[key] = isNamedInputs(input) ? resultsOf(input, nodes, propFunctions) : resultsOfInner(input, nodes, propFunctions);
        return tmp;
    }, {});
};
const resultOf = (source, nodes, propFunctions) => {
    const { result } = source.nodeId ? nodes[source.nodeId] : { result: undefined };
    return getDataFromSource(result, source, propFunctions);
};
// clean up object for anyInput
const cleanResultInner = (results) => {
    if (Array.isArray(results)) {
        return results.map((result) => cleanResultInner(result)).filter((result) => !isNull(result));
    }
    if (isObject(results)) {
        return Object.keys(results).reduce((tmp, key) => {
            const value = cleanResultInner(results[key]);
            if (!isNull(value)) {
                tmp[key] = value;
            }
            return tmp;
        }, {});
    }
    return results;
};
const cleanResult = (results) => {
    return Object.keys(results).reduce((tmp, key) => {
        const value = cleanResultInner(results[key]);
        if (!isNull(value)) {
            tmp[key] = value;
        }
        return tmp;
    }, {});
};

const graphDataAttributeKeys = ["nodes", "concurrency", "agentId", "loop", "verbose", "version"];
const computedNodeAttributeKeys = [
    "inputs",
    "anyInput",
    "params",
    "retry",
    "timeout",
    "agent",
    "graph",
    "graphLoader",
    "isResult",
    "priority",
    "if",
    "unless",
    "filterParams",
    "console",
    "passThrough",
];
const staticNodeAttributeKeys = ["value", "update", "isResult", "console"];
class ValidationError extends Error {
    constructor(message) {
        super(`\x1b[41m${message}\x1b[0m`); // Pass the message to the base Error class
        // Set the prototype explicitly to ensure correct prototype chain
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

const graphNodesValidator = (data) => {
    if (data.nodes === undefined) {
        throw new ValidationError("Invalid Graph Data: no nodes");
    }
    if (typeof data.nodes !== "object") {
        throw new ValidationError("Invalid Graph Data: invalid nodes");
    }
    if (Array.isArray(data.nodes)) {
        throw new ValidationError("Invalid Graph Data: nodes must be object");
    }
    if (Object.keys(data.nodes).length === 0) {
        throw new ValidationError("Invalid Graph Data: nodes is empty");
    }
    Object.keys(data).forEach((key) => {
        if (!graphDataAttributeKeys.includes(key)) {
            throw new ValidationError("Graph Data does not allow " + key);
        }
    });
};
const graphDataValidator = (data) => {
    if (data.loop) {
        if (data.loop.count === undefined && data.loop.while === undefined) {
            throw new ValidationError("Loop: Either count or while is required in loop");
        }
        if (data.loop.count !== undefined && data.loop.while !== undefined) {
            throw new ValidationError("Loop: Both count and while cannot be set");
        }
    }
    if (data.concurrency !== undefined) {
        if (!Number.isInteger(data.concurrency)) {
            throw new ValidationError("Concurrency must be an integer");
        }
        if (data.concurrency < 1) {
            throw new ValidationError("Concurrency must be a positive integer");
        }
    }
};

const nodeValidator = (nodeData) => {
    if (nodeData.agent && nodeData.value) {
        throw new ValidationError("Cannot set both agent and value");
    }
    if (!("agent" in nodeData) && !("value" in nodeData)) {
        throw new ValidationError("Either agent or value is required");
    }
    return true;
};

const staticNodeValidator = (nodeData) => {
    Object.keys(nodeData).forEach((key) => {
        if (!staticNodeAttributeKeys.includes(key)) {
            throw new ValidationError("Static node does not allow " + key);
        }
    });
    return true;
};

const computedNodeValidator = (nodeData) => {
    Object.keys(nodeData).forEach((key) => {
        if (!computedNodeAttributeKeys.includes(key)) {
            throw new ValidationError("Computed node does not allow " + key);
        }
    });
    return true;
};

const relationValidator = (data, staticNodeIds, computedNodeIds) => {
    const nodeIds = new Set(Object.keys(data.nodes));
    const pendings = {};
    const waitlist = {};
    // validate input relation and set pendings and wait list
    computedNodeIds.forEach((computedNodeId) => {
        const nodeData = data.nodes[computedNodeId];
        pendings[computedNodeId] = new Set();
        const dataSourceValidator = (sourceType, sourceNodeIds) => {
            sourceNodeIds.forEach((sourceNodeId) => {
                if (sourceNodeId) {
                    if (!nodeIds.has(sourceNodeId)) {
                        throw new ValidationError(`${sourceType} not match: NodeId ${computedNodeId}, Inputs: ${sourceNodeId}`);
                    }
                    waitlist[sourceNodeId] === undefined && (waitlist[sourceNodeId] = new Set());
                    pendings[computedNodeId].add(sourceNodeId);
                    waitlist[sourceNodeId].add(computedNodeId);
                }
            });
        };
        if ("agent" in nodeData && nodeData) {
            if (nodeData.inputs) {
                const sourceNodeIds = dataSourceNodeIds(inputs2dataSources(nodeData.inputs));
                dataSourceValidator("Inputs", sourceNodeIds);
            }
            if (nodeData.if) {
                const sourceNodeIds = dataSourceNodeIds(inputs2dataSources({ if: nodeData.if }));
                dataSourceValidator("If", sourceNodeIds);
            }
            if (nodeData.unless) {
                const sourceNodeIds = dataSourceNodeIds(inputs2dataSources({ unless: nodeData.unless }));
                dataSourceValidator("Unless", sourceNodeIds);
            }
            if (nodeData.graph && typeof nodeData?.graph === "string") {
                const sourceNodeIds = dataSourceNodeIds(inputs2dataSources({ graph: nodeData.graph }));
                dataSourceValidator("Graph", sourceNodeIds);
            }
        }
    });
    // TODO. validate update
    staticNodeIds.forEach((staticNodeId) => {
        const nodeData = data.nodes[staticNodeId];
        if ("value" in nodeData && nodeData.update) {
            const update = nodeData.update;
            const updateNodeId = parseNodeName(update).nodeId;
            if (!updateNodeId) {
                throw new ValidationError("Update it a literal");
            }
            if (!nodeIds.has(updateNodeId)) {
                throw new ValidationError(`Update not match: NodeId ${staticNodeId}, update: ${update}`);
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
        throw new ValidationError("No Initial Runnning Node");
    }
    do {
        runningQueue = cycle(runningQueue);
    } while (runningQueue.length > 0);
    if (Object.keys(pendings).length > 0) {
        throw new ValidationError("Some nodes are not executed: " + Object.keys(pendings).join(", "));
    }
};

const agentValidator = (graphAgentIds, agentIds) => {
    graphAgentIds.forEach((agentId) => {
        if (!agentIds.has(agentId)) {
            throw new ValidationError("Invalid Agent : " + agentId + " is not in AgentFunctionInfoDictionary.");
        }
    });
    return true;
};

const validateGraphData = (data, agentIds) => {
    graphNodesValidator(data);
    graphDataValidator(data);
    const computedNodeIds = [];
    const staticNodeIds = [];
    const graphAgentIds = new Set();
    Object.keys(data.nodes).forEach((nodeId) => {
        const node = data.nodes[nodeId];
        const isStaticNode = "value" in node;
        nodeValidator(node);
        const agentId = isStaticNode ? "" : node.agent;
        isStaticNode && staticNodeValidator(node) && staticNodeIds.push(nodeId);
        !isStaticNode && computedNodeValidator(node) && computedNodeIds.push(nodeId) && typeof agentId === "string" && graphAgentIds.add(agentId);
    });
    agentValidator(graphAgentIds, new Set(agentIds));
    relationValidator(data, staticNodeIds, computedNodeIds);
    return true;
};

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
        assert(count <= this.taskQueue.length, "TaskManager.addTask: Something is really wrong.");
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
        assert(this.runningNodes.has(node), `TaskManager.onComplete node(${node.nodeId}) is not in list`);
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

const defaultConcurrency = 8;
const graphDataLatestVersion = 0.5;
class GraphAI {
    // This method is called when either the GraphAI obect was created,
    // or we are about to start n-th iteration (n>2).
    createNodes(data) {
        const nodes = Object.keys(data.nodes).reduce((_nodes, nodeId) => {
            const nodeData = data.nodes[nodeId];
            if ("value" in nodeData) {
                _nodes[nodeId] = new StaticNode(nodeId, nodeData, this);
            }
            else if ("agent" in nodeData) {
                _nodes[nodeId] = new ComputedNode(this.graphId, nodeId, nodeData, this);
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
        return getDataFromSource(source.nodeId ? results[source.nodeId] : undefined, source, this.propFunctions);
    }
    // for static
    initializeStaticNodes(enableConsoleLog = false) {
        // If the result property is specified, inject it.
        // If the previousResults exists (indicating we are in a loop),
        // process the update property (nodeId or nodeId.propId).
        Object.keys(this.data.nodes).forEach((nodeId) => {
            const node = this.nodes[nodeId];
            if (node?.isStaticNode) {
                const value = node?.value;
                if (value !== undefined) {
                    this.injectValue(nodeId, value, nodeId);
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
        Object.keys(this.data.nodes).forEach((nodeId) => {
            const node = this.nodes[nodeId];
            if (node?.isStaticNode) {
                const update = node?.update;
                if (update && previousResults) {
                    const result = this.getValueFromResults(update, previousResults);
                    this.injectValue(nodeId, result, update.nodeId);
                }
                if (enableConsoleLog) {
                    node.consoleLog();
                }
            }
        });
    }
    constructor(data, agentFunctionInfoDictionary, options = {
        taskManager: undefined,
        agentFilters: [],
        bypassAgentIds: [],
        config: {},
        graphLoader: undefined,
    }) {
        this.logs = [];
        this.config = {};
        this.onLogCallback = (__log, __isUpdate) => { };
        this.repeatCount = 0;
        if (!data.version && !options.taskManager) {
            console.warn("------------ missing version number");
        }
        this.version = data.version ?? graphDataLatestVersion;
        if (this.version < graphDataLatestVersion) {
            console.warn(`------------ upgrade to ${graphDataLatestVersion}!`);
        }
        this.retryLimit = data.retry; // optional
        this.graphId = URL.createObjectURL(new Blob()).slice(-36);
        this.data = data;
        this.agentFunctionInfoDictionary = agentFunctionInfoDictionary;
        this.propFunctions = propFunctions;
        this.taskManager = options.taskManager ?? new TaskManager(data.concurrency ?? defaultConcurrency);
        this.agentFilters = options.agentFilters ?? [];
        this.bypassAgentIds = options.bypassAgentIds ?? [];
        this.config = options.config;
        this.graphLoader = options.graphLoader;
        this.loop = data.loop;
        this.verbose = data.verbose === true;
        this.onComplete = () => {
            throw new Error("SOMETHING IS WRONG: onComplete is called without run()");
        };
        validateGraphData(data, [...Object.keys(agentFunctionInfoDictionary), ...this.bypassAgentIds]);
        this.nodes = this.createNodes(data);
        this.initializeStaticNodes(true);
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
                inputs: null,
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
            assert(node.nodeId === _node.nodeId, "GraphAI.pushQueue node mismatch");
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
        if (!loop) {
            return false;
        }
        // We need to update static nodes, before checking the condition
        const previousResults = this.results(true); // results from previous loop
        this.updateStaticNodes(previousResults);
        if (loop.count === undefined || this.repeatCount < loop.count) {
            if (loop.while) {
                const source = parseNodeName(loop.while);
                const value = this.getValueFromResults(source, this.results(true));
                // NOTE: We treat an empty array as false.
                if (!isLogicallyTrue(value)) {
                    return false; // while condition is not met
                }
            }
            this.nodes = this.createNodes(this.data);
            this.initializeStaticNodes();
            this.updateStaticNodes(previousResults, true);
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
    resultsOf(inputs, anyInput = false) {
        const results = resultsOf(inputs ?? [], this.nodes, this.propFunctions);
        if (anyInput) {
            return cleanResult(results);
        }
        return results;
    }
    resultOf(source) {
        return resultOf(source, this.nodes, this.propFunctions);
    }
}

export { GraphAI, NodeState, ValidationError, agentInfoWrapper, assert, defaultAgentInfo, defaultConcurrency, defaultTestContext, graphDataLatestVersion, inputs2dataSources, isObject, parseNodeName, sleep, strIntentionalError };
//# sourceMappingURL=bundle.esm.js.map
