(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.vanilla_agents = {}));
})(this, (function (exports) { 'use strict';

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
    const isNamedInputs$1 = (namedInputs) => {
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
        if (isNamedInputs$1(input)) {
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
            tmp[key] = isNamedInputs$1(input) ? resultsOf(input, nodes, propFunctions) : resultsOfInner(input, nodes, propFunctions);
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

    // This agent strip one long string into chunks using following parameters
    //
    //  chunkSize: number; // default is 2048
    //  overlap: number;   // default is 1/8th of chunkSize.
    //
    // see example
    //  tests/agents/test_string_agent.ts
    //
    const defaultChunkSize = 2048;
    const stringSplitterAgent = async ({ params, namedInputs }) => {
        assert(!!namedInputs, "stringSplitterAgent: namedInputs is UNDEFINED!");
        const source = namedInputs.text;
        const chunkSize = params.chunkSize ?? defaultChunkSize;
        const overlap = params.overlap ?? Math.floor(chunkSize / 8);
        const count = Math.floor(source.length / (chunkSize - overlap)) + 1;
        const contents = new Array(count).fill(undefined).map((_, i) => {
            const startIndex = i * (chunkSize - overlap);
            return source.substring(startIndex, startIndex + chunkSize);
        });
        return { contents, count, chunkSize, overlap };
    };
    // for test and document
    const sampleInput = {
        text: "Here's to the crazy ones, the misfits, the rebels, the troublemakers, the round pegs in the square holes ... the ones who see things differently -- they're not fond of rules, and they have no respect for the status quo. ... You can quote them, disagree with them, glorify or vilify them, but the only thing you can't do is ignore them because they change things. ... They push the human race forward, and while some may see them as the crazy ones, we see genius, because the people who are crazy enough to think that they can change the world, are the ones who do.",
    };
    const sampleParams = { chunkSize: 64 };
    const sampleResult = {
        contents: [
            "Here's to the crazy ones, the misfits, the rebels, the troublema",
            "roublemakers, the round pegs in the square holes ... the ones wh",
            " ones who see things differently -- they're not fond of rules, a",
            "rules, and they have no respect for the status quo. ... You can ",
            "You can quote them, disagree with them, glorify or vilify them, ",
            "y them, but the only thing you can't do is ignore them because t",
            "ecause they change things. ... They push the human race forward,",
            "forward, and while some may see them as the crazy ones, we see g",
            "we see genius, because the people who are crazy enough to think ",
            "o think that they can change the world, are the ones who do.",
            " do.",
        ],
        count: 11,
        chunkSize: 64,
        overlap: 8,
    };
    const stringSplitterAgentInfo = {
        name: "stringSplitterAgent",
        agent: stringSplitterAgent,
        mock: stringSplitterAgent,
        inputs: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "text to be chuncked",
                },
            },
            required: ["text"],
        },
        output: {
            type: "object",
            properties: {
                contents: {
                    type: "array",
                    description: "the array of text chunks",
                },
                count: {
                    type: "number",
                    description: "the number of chunks",
                },
                chunkSize: {
                    type: "number",
                    description: "the chunk size",
                },
                overlap: {
                    type: "number",
                    description: "the overlap size",
                },
            },
        },
        samples: [
            {
                inputs: sampleInput,
                params: sampleParams,
                result: sampleResult,
            },
        ],
        description: "This agent strip one long string into chunks using following parameters",
        category: ["string"],
        author: "Satoshi Nakajima",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const processTemplate = (template, match, input) => {
        if (typeof template === "string") {
            if (template === match) {
                return input;
            }
            return template.replace(match, input);
        }
        else if (Array.isArray(template)) {
            return template.map((item) => processTemplate(item, match, input));
        }
        if (isObject(template)) {
            return Object.keys(template).reduce((tmp, key) => {
                tmp[key] = processTemplate(template[key], match, input);
                return tmp;
            }, {});
        }
        return template;
    };
    const stringTemplateAgent = async ({ params, inputs, namedInputs }) => {
        if (params.template === undefined) {
            if (namedInputs.text) {
                return namedInputs.text;
            }
            console.warn("warning: stringTemplateAgent no template");
        }
        if (inputs && inputs.length > 0) {
            return inputs.reduce((template, input, index) => {
                return processTemplate(template, "${" + index + "}", input);
            }, params.template);
        }
        return Object.keys(namedInputs).reduce((template, key) => {
            return processTemplate(template, "${" + key + "}", namedInputs[key]);
        }, params.template);
    };
    const sampleNamedInput = { message1: "hello", message2: "test" };
    // for test and document
    const stringTemplateAgentInfo = {
        name: "stringTemplateAgent",
        agent: stringTemplateAgent,
        mock: stringTemplateAgent,
        samples: [
            // named
            {
                inputs: sampleNamedInput,
                params: { template: "${message1}: ${message2}" },
                result: "hello: test",
            },
            {
                inputs: sampleNamedInput,
                params: { template: ["${message1}: ${message2}", "${message2}: ${message1}"] },
                result: ["hello: test", "test: hello"],
            },
            {
                inputs: sampleNamedInput,
                params: { template: { apple: "${message1}", lemon: "${message2}" } },
                result: { apple: "hello", lemon: "test" },
            },
            {
                inputs: sampleNamedInput,
                params: { template: [{ apple: "${message1}", lemon: "${message2}" }] },
                result: [{ apple: "hello", lemon: "test" }],
            },
            {
                inputs: sampleNamedInput,
                params: { template: { apple: "${message1}", lemon: ["${message2}"] } },
                result: { apple: "hello", lemon: ["test"] },
            },
            // graphData
            {
                inputs: { agent: "openAiAgent", row: "hello world", params: { text: "message" } },
                params: {
                    template: {
                        version: 0.5,
                        nodes: {
                            ai: {
                                agent: "${agent}",
                                isResult: true,
                                params: "${params}",
                                inputs: { prompt: "${row}" },
                            },
                        },
                    },
                },
                result: {
                    nodes: {
                        ai: {
                            agent: "openAiAgent",
                            inputs: {
                                prompt: "hello world",
                            },
                            isResult: true,
                            params: { text: "message" },
                        },
                    },
                    version: 0.5,
                },
            },
        ],
        description: "Template agent",
        category: ["string"],
        author: "Satoshi Nakajima",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const jsonParserAgent = async ({ namedInputs }) => {
        const { text, data } = namedInputs;
        if (data) {
            return JSON.stringify(data, null, 2);
        }
        const match = ("\n" + text).match(/\n```[a-zA-z]*([\s\S]*?)\n```/);
        if (match) {
            return JSON.parse(match[1]);
        }
        return JSON.parse(text);
    };
    const sample_object = { apple: "red", lemon: "yellow" };
    const json_str = JSON.stringify(sample_object);
    const md_json1 = ["```", json_str, "```"].join("\n");
    const md_json2 = ["```json", json_str, "```"].join("\n");
    const md_json3 = ["```JSON", json_str, "```"].join("\n");
    const jsonParserAgentInfo = {
        name: "jsonParserAgent",
        agent: jsonParserAgent,
        mock: jsonParserAgent,
        inputs: {
            anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
        },
        output: {
            type: "string",
        },
        samples: [
            {
                inputs: { data: sample_object },
                params: {},
                result: JSON.stringify(sample_object, null, 2),
            },
            {
                inputs: { text: JSON.stringify(sample_object, null, 2) },
                params: {},
                result: sample_object,
            },
            {
                inputs: { text: md_json1 },
                params: {},
                result: sample_object,
            },
            {
                inputs: { text: md_json2 },
                params: {},
                result: sample_object,
            },
            {
                inputs: { text: md_json3 },
                params: {},
                result: sample_object,
            },
        ],
        description: "Template agent",
        category: ["string"],
        author: "Satoshi Nakajima",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    var lib = {};

    Object.defineProperty(lib, "__esModule", { value: true });
    var isNamedInputs_1 = lib.isNamedInputs = lib.sample2GraphData = void 0;
    const sample2GraphData = (sample, agentName) => {
        const nodes = {};
        const inputs = (() => {
            if (Array.isArray(sample.inputs)) {
                Array.from(sample.inputs.keys()).forEach((key) => {
                    nodes["sampleInput" + key] = {
                        value: sample.inputs[key],
                    };
                });
                return Object.keys(nodes).map((k) => ":" + k);
            }
            nodes["sampleInput"] = {
                value: sample.inputs,
            };
            return Object.keys(sample.inputs).reduce((tmp, key) => {
                tmp[key] = `:sampleInput.` + key;
                return tmp;
            }, {});
        })();
        nodes["node"] = {
            isResult: true,
            agent: agentName,
            params: sample.params,
            inputs: inputs,
            graph: sample.graph,
        };
        const graphData = {
            version: 0.5,
            nodes,
        };
        return graphData;
    };
    lib.sample2GraphData = sample2GraphData;
    const isNamedInputs = (namedInputs) => {
        return Object.keys(namedInputs || {}).length > 0;
    };
    isNamedInputs_1 = lib.isNamedInputs = isNamedInputs;

    const pushAgent = async ({ namedInputs, }) => {
        assert(isNamedInputs_1(namedInputs), "pushAgent: namedInputs is UNDEFINED! Set inputs: { array: :arrayNodeId, item: :itemNodeId }");
        const { item, items } = namedInputs;
        assert(!!namedInputs.array, "pushAgent: namedInputs.array is UNDEFINED! Set inputs: { array: :arrayNodeId, item: :itemNodeId }");
        assert(!!(item || items), "pushAgent: namedInputs.item is UNDEFINED! Set inputs: { array: :arrayNodeId, item: :itemNodeId }");
        const array = namedInputs.array.map((item) => item); // shallow copy
        if (item) {
            array.push(item);
        }
        else {
            items.forEach((item) => {
                array.push(item);
            });
        }
        return {
            array,
        };
    };
    const pushAgentInfo = {
        name: "pushAgent",
        agent: pushAgent,
        mock: pushAgent,
        inputs: {
            type: "object",
            properties: {
                array: {
                    type: "array",
                    description: "the array to push an item to",
                },
                item: {
                    anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
                    description: "the item push into the array",
                },
                items: {
                    anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
                    description: "the item push into the array",
                },
            },
            required: ["array"],
        },
        output: {
            type: "object",
            properties: {
                array: {
                    type: "array",
                },
            },
        },
        samples: [
            {
                inputs: { array: [1, 2], item: 3 },
                params: {},
                result: { array: [1, 2, 3] },
            },
            {
                inputs: { array: [{ apple: 1 }], item: { lemon: 2 } },
                params: {},
                result: { array: [{ apple: 1 }, { lemon: 2 }] },
            },
            {
                inputs: { array: [{ apple: 1 }], items: [{ lemon: 2 }, { banana: 3 }] },
                params: {},
                result: { array: [{ apple: 1 }, { lemon: 2 }, { banana: 3 }] },
            },
        ],
        description: "push Agent",
        category: ["array"],
        author: "Receptron team",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const popAgent = async ({ namedInputs }) => {
        assert(isNamedInputs_1(namedInputs), "popAgent: namedInputs is UNDEFINED!");
        assert(!!namedInputs.array, "popAgent: namedInputs.array is UNDEFINED!");
        const array = namedInputs.array.map((item) => item); // shallow copy
        const item = array.pop();
        return { array, item };
    };
    const popAgentInfo = {
        name: "popAgent",
        agent: popAgent,
        mock: popAgent,
        inputs: {
            type: "object",
            properties: {
                array: {
                    type: "array",
                    description: "the array to pop an item from",
                },
            },
            required: ["array"],
        },
        output: {
            type: "object",
            properties: {
                item: {
                    anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
                    description: "the item popped from the array",
                },
                array: {
                    type: "array",
                    description: "the remaining array",
                },
            },
        },
        samples: [
            {
                inputs: { array: [1, 2, 3] },
                params: {},
                result: {
                    array: [1, 2],
                    item: 3,
                },
            },
            {
                inputs: { array: ["a", "b", "c"] },
                params: {},
                result: {
                    array: ["a", "b"],
                    item: "c",
                },
            },
            {
                inputs: {
                    array: [1, 2, 3],
                    array2: ["a", "b", "c"],
                },
                params: {},
                result: {
                    array: [1, 2],
                    item: 3,
                },
            },
        ],
        description: "Pop Agent",
        category: ["array"],
        author: "Receptron team",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const shiftAgent = async ({ namedInputs }) => {
        assert(!!namedInputs, "shiftAgent: namedInputs is UNDEFINED!");
        const array = namedInputs.array.map((item) => item); // shallow copy
        const item = array.shift();
        return { array, item };
    };
    const shiftAgentInfo = {
        name: "shiftAgent",
        agent: shiftAgent,
        mock: shiftAgent,
        inputs: {
            type: "object",
            properties: {
                array: {
                    type: "array",
                    description: "the array to shift an item from",
                },
            },
            required: ["array"],
        },
        output: {
            type: "object",
            properties: {
                item: {
                    anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
                    description: "the item shifted from the array",
                },
                array: {
                    type: "array",
                    description: "the remaining array",
                },
            },
        },
        samples: [
            {
                inputs: { array: [1, 2, 3] },
                params: {},
                result: {
                    array: [2, 3],
                    item: 1,
                },
            },
            {
                inputs: { array: ["a", "b", "c"] },
                params: {},
                result: {
                    array: ["b", "c"],
                    item: "a",
                },
            },
        ],
        description: "shift Agent",
        category: ["array"],
        author: "Receptron team",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const arrayFlatAgent = async ({ namedInputs, params, }) => {
        assert(!!namedInputs, "arrayFlatAgent: namedInputs is UNDEFINED!");
        const depth = params.depth ?? 1;
        const array = namedInputs.array.map((item) => item); // shallow copy
        return { array: array.flat(depth) };
    };
    const arrayFlatAgentInfo = {
        name: "arrayFlatAgent",
        agent: arrayFlatAgent,
        mock: arrayFlatAgent,
        inputs: {
            type: "object",
            properties: {
                array: {
                    type: "array",
                    description: "flat array",
                },
            },
            required: ["array"],
        },
        output: {
            type: "object",
            properties: {
                array: {
                    type: "array",
                    description: "the remaining array",
                },
            },
        },
        params: {
            type: "object",
            properties: {
                depth: {
                    type: "number",
                    description: "array depth",
                },
            },
        },
        samples: [
            {
                inputs: { array: [[1], [2], [3]] },
                params: {},
                result: {
                    array: [1, 2, 3],
                },
            },
            {
                inputs: { array: [[1], [2], [[3]]] },
                params: {},
                result: {
                    array: [1, 2, [3]],
                },
            },
            {
                inputs: { array: [[1], [2], [[3]]] },
                params: { depth: 2 },
                result: {
                    array: [1, 2, 3],
                },
            },
            {
                inputs: { array: [["a"], ["b"], ["c"]] },
                params: {},
                result: {
                    array: ["a", "b", "c"],
                },
            },
        ],
        description: "Array Flat Agent",
        category: ["array"],
        author: "Receptron team",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const arrayJoinAgent = async ({ namedInputs, params, }) => {
        assert(!!namedInputs, "arrayJoinAgent: namedInputs is UNDEFINED!");
        assert(!!namedInputs.array, "arrayJoinAgent: namedInputs.array is UNDEFINED!");
        const separator = params.separator ?? "";
        const { flat } = params;
        const text = flat ? namedInputs.array.flat(flat).join(separator) : namedInputs.array.join(separator);
        return { text };
    };
    const arrayJoinAgentInfo = {
        name: "arrayJoinAgent",
        agent: arrayJoinAgent,
        mock: arrayJoinAgent,
        inputs: {
            type: "object",
            properties: {
                array: {
                    type: "array",
                    description: "array join",
                },
            },
            required: ["array"],
        },
        params: {
            type: "object",
            properties: {
                separator: {
                    type: "string",
                    description: "array join separator",
                },
                flat: {
                    type: "number",
                    description: "array flat depth",
                },
            },
        },
        output: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "joined text",
                },
            },
        },
        samples: [
            {
                inputs: { array: [[1], [2], [3]] },
                params: {},
                result: {
                    text: "123",
                },
            },
            {
                inputs: { array: [[1], [2], [[3]]] },
                params: {},
                result: {
                    text: "123",
                },
            },
            {
                inputs: { array: [["a"], ["b"], ["c"]] },
                params: {},
                result: {
                    text: "abc",
                },
            },
            //
            {
                inputs: { array: [[1], [2], [3]] },
                params: { separator: "|" },
                result: {
                    text: "1|2|3",
                },
            },
            {
                inputs: { array: [[[1]], [[2], [3]]] },
                params: { separator: "|" },
                result: {
                    text: "1|2,3",
                },
            },
            {
                inputs: { array: [[[1]], [[2], [3]]] },
                params: { separator: "|", flat: 1 },
                result: {
                    text: "1|2|3",
                },
            },
            {
                inputs: { array: [[[[1]], [[2], [3]]]] },
                params: { separator: "|", flat: 1 },
                result: {
                    text: "1|2,3",
                },
            },
            {
                inputs: { array: [[[[1]], [[2], [3]]]] },
                params: { separator: "|", flat: 2 },
                result: {
                    text: "1|2|3",
                },
            },
        ],
        description: "Array Join Agent",
        category: ["array"],
        author: "Receptron team",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    // This agent calculates the dot product of an array of vectors (A[]) and a vector (B),
    // typically used to calculate cosine similarity of embedding vectors.
    // Inputs:
    //  matrix: Two dimentional array of numbers.
    //  vector: One dimentional array of numbers.
    // Outputs:
    //  { contents: Array<number> } // array of docProduct of each vector (A[]) and vector B
    const dotProductAgent = async ({ namedInputs, }) => {
        assert(!!namedInputs, "dotProductAgent: namedInputs is UNDEFINED!");
        const matrix = namedInputs.matrix;
        const vector = namedInputs.vector;
        if (matrix[0].length != vector.length) {
            throw new Error(`dotProduct: Length of vectors do not match. ${matrix[0].length}, ${vector.length}`);
        }
        const contents = matrix.map((vector0) => {
            return vector0.reduce((dotProduct, value, index) => {
                return dotProduct + value * vector[index];
            }, 0);
        });
        return contents;
    };
    const dotProductAgentInfo = {
        name: "dotProductAgent",
        agent: dotProductAgent,
        mock: dotProductAgent,
        inputs: {
            type: "object",
            properties: {
                matrix: {
                    type: "array",
                    description: "two dimentional matrix",
                    items: {
                        type: "array",
                        items: {
                            type: "number",
                        },
                    },
                },
                vector: {
                    type: "array",
                    description: "the vector",
                    items: {
                        type: "number",
                    },
                },
            },
            required: ["matrix", "vector"],
        },
        output: {
            type: "array",
        },
        samples: [
            {
                inputs: {
                    matrix: [
                        [1, 2],
                        [3, 4],
                        [5, 6],
                    ],
                    vector: [3, 2],
                },
                params: {},
                result: [7, 17, 27],
            },
            {
                inputs: {
                    matrix: [
                        [1, 2],
                        [2, 3],
                    ],
                    vector: [1, 2],
                },
                params: {},
                result: [5, 8],
            },
        ],
        description: "dotProduct Agent",
        category: ["matrix"],
        author: "Receptron team",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    // This agent returned a sorted array of one array (A) based on another array (B).
    // The default sorting order is "decendant".
    //
    // Parameters:
    //  acendant: Specifies if the sorting order should be acendant. The default is "false" (decendant).
    // Inputs:
    //  array: Array<any>; // array to be sorted
    //  values: Array<number>; // array of numbers for sorting
    //
    const sortByValuesAgent = async ({ params, namedInputs }) => {
        assert(!!namedInputs, "sortByValue: namedInputs is UNDEFINED!");
        assert(!!namedInputs.array, "sortByValue: namedInputs.array is UNDEFINED!");
        assert(!!namedInputs.values, "sortByValue: namedInputs.values is UNDEFINED!");
        const direction = (params?.assendant ?? false) ? -1 : 1;
        const array = namedInputs.array;
        const values = namedInputs.values;
        const joined = array.map((item, index) => {
            return { item, value: values[index] };
        });
        const contents = joined
            .sort((a, b) => {
            return (b.value - a.value) * direction;
        })
            .map((a) => {
            return a.item;
        });
        return contents;
    };
    const sortByValuesAgentInfo = {
        name: "sortByValuesAgent",
        agent: sortByValuesAgent,
        mock: sortByValuesAgent,
        inputs: {
            type: "object",
            properties: {
                array: {
                    type: "array",
                    description: "the array to sort",
                },
                values: {
                    type: "array",
                    description: "values associated with items in the array",
                },
            },
            required: ["array", "values"],
        },
        output: {
            type: "array",
        },
        samples: [
            {
                inputs: {
                    array: ["banana", "orange", "lemon", "apple"],
                    values: [2, 5, 6, 4],
                },
                params: {},
                result: ["lemon", "orange", "apple", "banana"],
            },
            {
                inputs: {
                    array: ["banana", "orange", "lemon", "apple"],
                    values: [2, 5, 6, 4],
                },
                params: {
                    assendant: true,
                },
                result: ["banana", "apple", "orange", "lemon"],
            },
        ],
        description: "sortByValues Agent",
        category: ["matrix"],
        author: "Receptron team",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const echoAgent = async ({ params, filterParams }) => {
        if (params.filterParams) {
            return filterParams;
        }
        return params;
    };
    // for test and document
    const echoAgentInfo = {
        name: "echoAgent",
        agent: echoAgent,
        mock: echoAgent,
        samples: [
            {
                inputs: {},
                params: { text: "this is test" },
                result: { text: "this is test" },
            },
            {
                inputs: {},
                params: {
                    text: "If you add filterParams option, it will respond to filterParams",
                    filterParams: true,
                },
                result: {},
            },
        ],
        description: "Echo agent",
        category: ["test"],
        author: "Satoshi Nakajima",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const countingAgent = async ({ params }) => {
        return {
            list: new Array(params.count).fill(undefined).map((_, i) => {
                return i;
            }),
        };
    };
    // for test and document
    const countingAgentInfo = {
        name: "countingAgent",
        agent: countingAgent,
        mock: countingAgent,
        samples: [
            {
                inputs: {},
                params: { count: 4 },
                result: { list: [0, 1, 2, 3] },
            },
        ],
        description: "Counting agent",
        category: ["test"],
        author: "Receptron team",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const copyMessageAgent = async ({ params }) => {
        return {
            messages: new Array(params.count).fill(undefined).map(() => {
                return params.message;
            }),
        };
    };
    // for test and document
    const copyMessageAgentInfo = {
        name: "copyMessageAgent",
        agent: copyMessageAgent,
        mock: copyMessageAgent,
        samples: [
            {
                inputs: {},
                params: { count: 4, message: "hello" },
                result: { messages: ["hello", "hello", "hello", "hello"] },
            },
        ],
        description: "CopyMessage agent",
        category: ["test"],
        author: "Receptron team",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const copy2ArrayAgent = async ({ inputs, namedInputs, params }) => {
        const input = isNamedInputs_1(namedInputs) ? (namedInputs.item ? namedInputs.item : namedInputs) : inputs[0];
        return new Array(params.count).fill(undefined).map(() => {
            return input;
        });
    };
    // for test and document
    const copy2ArrayAgentInfo = {
        name: "copy2ArrayAgent",
        agent: copy2ArrayAgent,
        mock: copy2ArrayAgent,
        samples: [
            {
                inputs: { item: { message: "hello" } },
                params: { count: 10 },
                result: [
                    { message: "hello" },
                    { message: "hello" },
                    { message: "hello" },
                    { message: "hello" },
                    { message: "hello" },
                    { message: "hello" },
                    { message: "hello" },
                    { message: "hello" },
                    { message: "hello" },
                    { message: "hello" },
                ],
            },
            {
                inputs: { message: "hello" },
                params: { count: 10 },
                result: [
                    { message: "hello" },
                    { message: "hello" },
                    { message: "hello" },
                    { message: "hello" },
                    { message: "hello" },
                    { message: "hello" },
                    { message: "hello" },
                    { message: "hello" },
                    { message: "hello" },
                    { message: "hello" },
                ],
            },
            {
                inputs: { item: "hello" },
                params: { count: 10 },
                result: ["hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello"],
            },
        ],
        description: "Copy2Array agent",
        category: ["test"],
        author: "Receptron team",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const mergeNodeIdAgent = async ({ debugInfo: { nodeId }, inputs, namedInputs, }) => {
        // console.log("executing", nodeId);
        const dataSet = isNamedInputs_1(namedInputs) ? namedInputs.array : inputs;
        return dataSet.reduce((tmp, input) => {
            return { ...tmp, ...input };
        }, { [nodeId]: "hello" });
    };
    // for test and document
    const mergeNodeIdAgentInfo = {
        name: "mergeNodeIdAgent",
        agent: mergeNodeIdAgent,
        mock: mergeNodeIdAgent,
        samples: [
            {
                inputs: { array: [{ message: "hello" }] },
                params: {},
                result: {
                    message: "hello",
                    test: "hello",
                },
            },
        ],
        description: "merge node id agent",
        category: ["test"],
        author: "Receptron team",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const streamMockAgent = async ({ params, filterParams, namedInputs }) => {
        const message = params.message ?? namedInputs.message ?? "";
        for await (const token of message.split("")) {
            if (filterParams.streamTokenCallback) {
                filterParams.streamTokenCallback(token);
            }
            await sleep(params.sleep || 100);
        }
        return { message };
    };
    // for test and document
    const streamMockAgentInfo = {
        name: "streamMockAgent",
        agent: streamMockAgent,
        mock: streamMockAgent,
        inputs: {
            anyOf: [
                {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "streaming message",
                        },
                    },
                },
                {
                    type: "array",
                },
            ],
        },
        samples: [
            {
                inputs: {},
                params: { message: "this is params test" },
                result: { message: "this is params test" },
            },
            {
                inputs: { message: "this is named inputs test" },
                params: {},
                result: { message: "this is named inputs test" },
            },
        ],
        description: "Stream mock agent",
        category: ["test"],
        author: "Isamu Arimoto",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
        stream: true,
    };

    const nestedAgent = async ({ namedInputs, agents, log, taskManager, graphData, agentFilters, debugInfo, config, onLogCallback, params, }) => {
        const throwError = params.throwError ?? false;
        if (taskManager) {
            const status = taskManager.getStatus(false);
            assert(status.concurrency > status.running, `nestedAgent: Concurrency is too low: ${status.concurrency}`);
        }
        assert(!!graphData, "nestedAgent: graph is required");
        const { nodes } = graphData;
        const nestedGraphData = { ...graphData, nodes: { ...nodes }, version: graphDataLatestVersion }; // deep enough copy
        const nodeIds = Object.keys(namedInputs);
        if (nodeIds.length > 0) {
            nodeIds.forEach((nodeId) => {
                if (nestedGraphData.nodes[nodeId] === undefined) {
                    // If the input node does not exist, automatically create a static node
                    nestedGraphData.nodes[nodeId] = { value: namedInputs[nodeId] };
                }
                else {
                    // Otherwise, inject the proper data here (instead of calling injectTo method later)
                    nestedGraphData.nodes[nodeId]["value"] = namedInputs[nodeId];
                }
            });
        }
        try {
            if (nestedGraphData.version === undefined && debugInfo.version) {
                nestedGraphData.version = debugInfo.version;
            }
            const graphAI = new GraphAI(nestedGraphData, agents || {}, {
                taskManager,
                agentFilters,
                config,
            });
            // for backward compatibility. Remove 'if' later
            if (onLogCallback) {
                graphAI.onLogCallback = onLogCallback;
            }
            const results = await graphAI.run(false);
            log?.push(...graphAI.transactionLogs());
            return results;
        }
        catch (error) {
            if (error instanceof Error && !throwError) {
                return {
                    onError: {
                        message: error.message,
                        error,
                    },
                };
            }
            throw error;
        }
    };
    const nestedAgentInfo = {
        name: "nestedAgent",
        agent: nestedAgent,
        mock: nestedAgent,
        samples: [
            {
                inputs: {
                    message: "hello",
                },
                params: {},
                result: {
                    test: ["hello"],
                },
                graph: {
                    nodes: {
                        test: {
                            agent: "copyAgent",
                            params: { namedKey: "messages" },
                            inputs: { messages: [":message"] },
                            isResult: true,
                        },
                    },
                },
            },
        ],
        description: "nested Agent",
        category: ["graph"],
        author: "Receptron team",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const mapAgent = async ({ params, namedInputs, agents, log, taskManager, graphData, agentFilters, debugInfo, config, onLogCallback }) => {
        if (taskManager) {
            const status = taskManager.getStatus();
            assert(status.concurrency > status.running, `mapAgent: Concurrency is too low: ${status.concurrency}`);
        }
        assert(!!namedInputs.rows, "mapAgent: rows property is required in namedInput");
        assert(!!graphData, "mapAgent: graph is required");
        const rows = namedInputs.rows.map((item) => item);
        if (params.limit && params.limit < rows.length) {
            rows.length = params.limit; // trim
        }
        const resultAll = params.resultAll ?? false;
        const throwError = params.throwError ?? false;
        const { nodes } = graphData;
        const nestedGraphData = { ...graphData, nodes: { ...nodes }, version: graphDataLatestVersion }; // deep enough copy
        const nodeIds = Object.keys(namedInputs);
        nodeIds.forEach((nodeId) => {
            const mappedNodeId = nodeId === "rows" ? "row" : nodeId;
            if (nestedGraphData.nodes[mappedNodeId] === undefined) {
                // If the input node does not exist, automatically create a static node
                nestedGraphData.nodes[mappedNodeId] = { value: namedInputs[nodeId] };
            }
            else {
                // Otherwise, inject the proper data here (instead of calling injectTo method later)
                nestedGraphData.nodes[mappedNodeId]["value"] = namedInputs[nodeId];
            }
        });
        try {
            if (nestedGraphData.version === undefined && debugInfo.version) {
                nestedGraphData.version = debugInfo.version;
            }
            const graphs = rows.map((row) => {
                const graphAI = new GraphAI(nestedGraphData, agents || {}, {
                    taskManager,
                    agentFilters: agentFilters || [],
                    config,
                });
                graphAI.injectValue("row", row, "__mapAgent_inputs__");
                // for backward compatibility. Remove 'if' later
                if (onLogCallback) {
                    graphAI.onLogCallback = onLogCallback;
                }
                return graphAI;
            });
            const runs = graphs.map((graph) => {
                return graph.run(resultAll);
            });
            const results = await Promise.all(runs);
            const nodeIds = Object.keys(results[0]);
            // assert(nodeIds.length > 0, "mapAgent: no return values (missing isResult)");
            if (log) {
                const logs = graphs.map((graph, index) => {
                    return graph.transactionLogs().map((log) => {
                        log.mapIndex = index;
                        return log;
                    });
                });
                log.push(...logs.flat());
            }
            if (params.compositeResult) {
                const compositeResult = nodeIds.reduce((tmp, nodeId) => {
                    tmp[nodeId] = results.map((result) => {
                        return result[nodeId];
                    });
                    return tmp;
                }, {});
                return compositeResult;
            }
            return results;
        }
        catch (error) {
            if (error instanceof Error && !throwError) {
                return {
                    onError: {
                        message: error.message,
                        error,
                    },
                };
            }
            throw error;
        }
    };
    const mapAgentInfo = {
        name: "mapAgent",
        agent: mapAgent,
        mock: mapAgent,
        samples: [
            {
                inputs: {
                    rows: [1, 2],
                },
                params: {},
                result: [{ test: [1] }, { test: [2] }],
                graph: {
                    nodes: {
                        test: {
                            agent: "copyAgent",
                            params: { namedKey: "rows" },
                            inputs: { rows: [":row"] },
                            isResult: true,
                        },
                    },
                },
            },
            {
                inputs: {
                    rows: ["apple", "orange", "banana", "lemon", "melon", "pineapple", "tomato"],
                },
                params: {},
                graph: {
                    nodes: {
                        node2: {
                            agent: "stringTemplateAgent",
                            params: {
                                template: "I love ${word}.",
                            },
                            inputs: { word: ":row" },
                            isResult: true,
                        },
                    },
                },
                result: [
                    { node2: "I love apple." },
                    { node2: "I love orange." },
                    { node2: "I love banana." },
                    { node2: "I love lemon." },
                    { node2: "I love melon." },
                    { node2: "I love pineapple." },
                    { node2: "I love tomato." },
                ],
            },
            {
                inputs: {
                    rows: [{ fruit: "apple" }, { fruit: "orange" }],
                },
                params: {},
                graph: {
                    nodes: {
                        node2: {
                            agent: "stringTemplateAgent",
                            params: {
                                template: "I love ${item}.",
                            },
                            inputs: { item: ":row.fruit" },
                            isResult: true,
                        },
                    },
                },
                result: [{ node2: "I love apple." }, { node2: "I love orange." }],
            },
            {
                inputs: {
                    rows: [{ fruit: "apple" }, { fruit: "orange" }],
                    name: "You",
                    verb: "like",
                },
                params: {},
                graph: {
                    nodes: {
                        node2: {
                            agent: "stringTemplateAgent",
                            params: {
                                template: "${name} ${verb} ${fruit}.",
                            },
                            inputs: { fruit: ":row.fruit", name: ":name", verb: ":verb" },
                            isResult: true,
                        },
                    },
                },
                result: [{ node2: "You like apple." }, { node2: "You like orange." }],
            },
            {
                inputs: {
                    rows: [1, 2],
                },
                params: {
                    resultAll: true,
                },
                result: [
                    {
                        test: [1],
                        row: 1,
                    },
                    {
                        test: [2],
                        row: 2,
                    },
                ],
                graph: {
                    nodes: {
                        test: {
                            agent: "copyAgent",
                            params: { namedKey: "rows" },
                            inputs: { rows: [":row"] },
                        },
                    },
                },
            },
            {
                inputs: {
                    rows: [1, 2],
                },
                params: {
                    resultAll: true,
                },
                result: [
                    {
                        map: [
                            {
                                test: 1,
                            },
                            {
                                test: 1,
                            },
                        ],
                        row: 1,
                        test: 1,
                    },
                    {
                        map: [
                            {
                                test: 2,
                            },
                            {
                                test: 2,
                            },
                        ],
                        test: 2,
                        row: 2,
                    },
                ],
                graph: {
                    nodes: {
                        test: {
                            agent: "copyAgent",
                            params: { namedKey: "row" },
                            inputs: { row: ":row" },
                        },
                        map: {
                            agent: "mapAgent",
                            inputs: { rows: [":test", ":test"] },
                            graph: {
                                nodes: {
                                    test: {
                                        isResult: true,
                                        agent: "copyAgent",
                                        params: { namedKey: "row" },
                                        inputs: { row: ":row" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            // old response
            {
                inputs: {
                    rows: [1, 2],
                },
                params: {
                    compositeResult: true,
                },
                result: {
                    test: [[1], [2]],
                },
                graph: {
                    nodes: {
                        test: {
                            agent: "copyAgent",
                            params: { namedKey: "rows" },
                            inputs: { rows: [":row"] },
                            isResult: true,
                        },
                    },
                },
            },
            {
                inputs: {
                    rows: ["apple", "orange", "banana", "lemon", "melon", "pineapple", "tomato"],
                },
                params: {
                    compositeResult: true,
                },
                graph: {
                    nodes: {
                        node2: {
                            agent: "stringTemplateAgent",
                            params: {
                                template: "I love ${row}.",
                            },
                            inputs: { row: ":row" },
                            isResult: true,
                        },
                    },
                },
                result: {
                    node2: ["I love apple.", "I love orange.", "I love banana.", "I love lemon.", "I love melon.", "I love pineapple.", "I love tomato."],
                },
            },
            {
                inputs: {
                    rows: [1, 2],
                },
                params: {
                    resultAll: true,
                    compositeResult: true,
                },
                result: {
                    test: [[1], [2]],
                    row: [1, 2],
                },
                graph: {
                    nodes: {
                        test: {
                            agent: "copyAgent",
                            params: { namedKey: "rows" },
                            inputs: { rows: [":row"] },
                        },
                    },
                },
            },
            {
                inputs: {
                    rows: [1, 2],
                },
                params: {
                    resultAll: true,
                    compositeResult: true,
                },
                result: {
                    test: [[1], [2]],
                    map: [
                        {
                            test: [[[1]], [[1]]],
                        },
                        {
                            test: [[[2]], [[2]]],
                        },
                    ],
                    row: [1, 2],
                },
                graph: {
                    nodes: {
                        test: {
                            agent: "copyAgent",
                            params: { namedKey: "rows" },
                            inputs: { rows: [":row"] },
                        },
                        map: {
                            agent: "mapAgent",
                            inputs: { rows: [":test", ":test"] },
                            params: {
                                compositeResult: true,
                            },
                            graph: {
                                nodes: {
                                    test: {
                                        isResult: true,
                                        agent: "copyAgent",
                                        params: { namedKey: "rows" },
                                        inputs: { rows: [":row"] },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        ],
        description: "Map Agent",
        category: ["graph"],
        author: "Receptron team",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const totalAgent = async ({ namedInputs }) => {
        assert(isNamedInputs_1(namedInputs), "totalAgent: namedInputs is UNDEFINED! Set inputs: { array: :arrayNodeId }");
        assert(!!namedInputs?.array, "totalAgent: namedInputs.array is UNDEFINED! Set inputs: { array: :arrayNodeId }");
        return namedInputs.array.reduce((result, input) => {
            const inputArray = Array.isArray(input) ? input : [input];
            inputArray.forEach((innerInput) => {
                Object.keys(innerInput).forEach((key) => {
                    const value = innerInput[key];
                    if (result[key]) {
                        result[key] += value;
                    }
                    else {
                        result[key] = value;
                    }
                });
            });
            return result;
        }, {});
    };
    //
    const totalAgentInfo = {
        name: "totalAgent",
        agent: totalAgent,
        mock: totalAgent,
        inputs: {
            type: "object",
            properties: {
                array: {
                    type: "array",
                    description: "the array",
                },
            },
            required: ["array"],
        },
        output: {
            type: "object",
        },
        samples: [
            {
                inputs: { array: [{ a: 1 }, { a: 2 }, { a: 3 }] },
                params: {},
                result: { a: 6 },
            },
            {
                inputs: { array: [[{ a: 1, b: -1 }, { c: 10 }], [{ a: 2, b: -1 }], [{ a: 3, b: -2 }, { d: -10 }]] },
                params: {},
                result: { a: 6, b: -4, c: 10, d: -10 },
            },
            {
                inputs: { array: [{ a: 1 }] },
                params: {},
                result: { a: 1 },
            },
            {
                inputs: { array: [{ a: 1 }, { a: 2 }] },
                params: {},
                result: { a: 3 },
            },
            {
                inputs: { array: [{ a: 1 }, { a: 2 }, { a: 3 }] },
                params: {},
                result: { a: 6 },
            },
            {
                inputs: {
                    array: [
                        { a: 1, b: 1 },
                        { a: 2, b: 2 },
                        { a: 3, b: 0 },
                    ],
                },
                params: {},
                result: { a: 6, b: 3 },
            },
            {
                inputs: { array: [{ a: 1 }, { a: 2, b: 2 }, { a: 3, b: 0 }] },
                params: {},
                result: { a: 6, b: 2 },
            },
        ],
        description: "Returns the sum of input values",
        category: ["data"],
        author: "Satoshi Nakajima",
        repository: "https://github.com/snakajima/graphai",
        license: "MIT",
    };

    const dataSumTemplateAgent = async ({ namedInputs }) => {
        assert(isNamedInputs_1(namedInputs), "dataSumTemplateAgent: namedInputs is UNDEFINED! Set inputs: { array: :arrayNodeId }");
        assert(!!namedInputs?.array, "dataSumTemplateAgent: namedInputs.array is UNDEFINED! Set inputs: { array: :arrayNodeId }");
        return namedInputs.array.reduce((tmp, input) => {
            return tmp + input;
        }, 0);
    };
    const dataSumTemplateAgentInfo = {
        name: "dataSumTemplateAgent",
        agent: dataSumTemplateAgent,
        mock: dataSumTemplateAgent,
        inputs: {
            type: "object",
            properties: {
                array: {
                    type: "array",
                    description: "the array of numbers to calculate the sum of",
                    items: {
                        type: "integer",
                    },
                },
            },
            required: ["array"],
        },
        output: {
            type: "number",
        },
        samples: [
            {
                inputs: { array: [1] },
                params: {},
                result: 1,
            },
            {
                inputs: { array: [1, 2] },
                params: {},
                result: 3,
            },
            {
                inputs: { array: [1, 2, 3] },
                params: {},
                result: 6,
            },
        ],
        description: "Returns the sum of input values",
        category: ["data"],
        author: "Satoshi Nakajima",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const applyFilter = (object, index, arrayInputs, include, exclude, alter, inject, swap, inspect) => {
        const propIds = include ? include : Object.keys(object);
        const excludeSet = new Set(exclude ?? []);
        const result = propIds.reduce((tmp, propId) => {
            if (!excludeSet.has(propId)) {
                const mapping = alter && alter[propId];
                if (mapping && mapping[object[propId]]) {
                    tmp[propId] = mapping[object[propId]];
                }
                else {
                    tmp[propId] = object[propId];
                }
            }
            return tmp;
        }, {});
        if (inject) {
            inject.forEach((item) => {
                if (item.index === undefined || item.index === index) {
                    result[item.propId] = arrayInputs[item.from];
                }
            });
        }
        if (inspect) {
            inspect.forEach((item) => {
                const value = arrayInputs[item.from ?? 1]; // default is arrayInputs[1]
                if (item.equal) {
                    result[item.propId] = item.equal === value;
                }
                else if (item.notEqual) {
                    result[item.propId] = item.notEqual !== value;
                }
            });
        }
        if (swap) {
            Object.keys(swap).forEach((key) => {
                const tmp = result[key];
                result[key] = result[swap[key]];
                result[swap[key]] = tmp;
            });
        }
        return result;
    };
    const propertyFilterAgent = async ({ namedInputs, params }) => {
        const { include, exclude, alter, inject, swap, inspect } = params;
        const { array, item } = namedInputs;
        if (array) {
            // This is advanced usage, including "inject" and "inspect", which uses
            // array[1], array[2], ...
            const [target] = array; // Extract the first one
            if (Array.isArray(target)) {
                return target.map((item, index) => applyFilter(item, index, array, include, exclude, alter, inject, swap, inspect));
            }
            return applyFilter(target, 0, array, include, exclude, alter, inject, swap, inspect);
        }
        else if (item) {
            return applyFilter(item, 0, [], include, exclude, alter, inject, swap, inspect);
        }
        return false;
    };
    const testInputs = {
        array: [
            [
                { color: "red", model: "Model 3", type: "EV", maker: "Tesla", range: 300 },
                { color: "blue", model: "Model Y", type: "EV", maker: "Tesla", range: 400 },
            ],
            "Tesla Motors",
        ],
    };
    const propertyFilterAgentInfo = {
        name: "propertyFilterAgent",
        agent: propertyFilterAgent,
        mock: propertyFilterAgent,
        inputs: {
            type: "object",
        },
        output: {
            type: "any",
            properties: {
                array: {
                    type: "array",
                    description: "the array to apply filter",
                },
                item: {
                    type: "object",
                    description: "the object to apply filter",
                },
            },
        },
        samples: [
            {
                inputs: { array: [testInputs.array[0][0]] },
                params: { include: ["color", "model"] },
                result: { color: "red", model: "Model 3" },
            },
            {
                inputs: { item: testInputs.array[0][0] },
                params: { include: ["color", "model"] },
                result: { color: "red", model: "Model 3" },
            },
            {
                inputs: testInputs,
                params: { include: ["color", "model"] },
                result: [
                    { color: "red", model: "Model 3" },
                    { color: "blue", model: "Model Y" },
                ],
            },
            {
                inputs: testInputs,
                params: { exclude: ["color", "model"] },
                result: [
                    { type: "EV", maker: "Tesla", range: 300 },
                    { type: "EV", maker: "Tesla", range: 400 },
                ],
            },
            {
                inputs: { item: testInputs.array[0][0] },
                params: { exclude: ["color", "model"] },
                result: { type: "EV", maker: "Tesla", range: 300 },
            },
            {
                inputs: testInputs,
                params: { alter: { color: { red: "blue", blue: "red" } } },
                result: [
                    {
                        color: "blue",
                        model: "Model 3",
                        type: "EV",
                        maker: "Tesla",
                        range: 300,
                    },
                    {
                        color: "red",
                        model: "Model Y",
                        type: "EV",
                        maker: "Tesla",
                        range: 400,
                    },
                ],
            },
            {
                inputs: { item: testInputs.array[0][0] },
                params: { alter: { color: { red: "blue", blue: "red" } } },
                result: {
                    color: "blue",
                    model: "Model 3",
                    type: "EV",
                    maker: "Tesla",
                    range: 300,
                },
            },
            {
                inputs: testInputs,
                params: { swap: { maker: "model" } },
                result: [
                    {
                        color: "red",
                        model: "Tesla",
                        type: "EV",
                        maker: "Model 3",
                        range: 300,
                    },
                    {
                        color: "blue",
                        model: "Tesla",
                        type: "EV",
                        maker: "Model Y",
                        range: 400,
                    },
                ],
            },
            {
                inputs: { item: testInputs.array[0][0] },
                params: { swap: { maker: "model" } },
                result: {
                    color: "red",
                    model: "Tesla",
                    type: "EV",
                    maker: "Model 3",
                    range: 300,
                },
            },
            {
                inputs: testInputs,
                params: { inject: [{ propId: "maker", from: 1 }] },
                result: [
                    {
                        color: "red",
                        model: "Model 3",
                        type: "EV",
                        maker: "Tesla Motors",
                        range: 300,
                    },
                    {
                        color: "blue",
                        model: "Model Y",
                        type: "EV",
                        maker: "Tesla Motors",
                        range: 400,
                    },
                ],
            },
            {
                inputs: testInputs,
                params: { inject: [{ propId: "maker", from: 1, index: 0 }] },
                result: [
                    {
                        color: "red",
                        model: "Model 3",
                        type: "EV",
                        maker: "Tesla Motors",
                        range: 300,
                    },
                    {
                        color: "blue",
                        model: "Model Y",
                        type: "EV",
                        maker: "Tesla",
                        range: 400,
                    },
                ],
            },
            {
                inputs: testInputs,
                params: {
                    inspect: [
                        { propId: "isTesla", equal: "Tesla Motors" }, // from: 1 is implied
                        { propId: "isGM", notEqual: "Tesla Motors", from: 1 },
                    ],
                },
                result: [
                    {
                        color: "red",
                        model: "Model 3",
                        type: "EV",
                        maker: "Tesla",
                        range: 300,
                        isTesla: true,
                        isGM: false,
                    },
                    {
                        color: "blue",
                        model: "Model Y",
                        type: "EV",
                        maker: "Tesla",
                        range: 400,
                        isTesla: true,
                        isGM: false,
                    },
                ],
            },
        ],
        description: "Filter properties based on property name either with 'include', 'exclude', 'alter', 'swap', 'inject', 'inspect'",
        category: ["data"],
        author: "Receptron team",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const copyAgent = async ({ namedInputs, params }) => {
        const { namedKey } = params;
        assert(isNamedInputs_1(namedInputs), "copyAgent: namedInputs is UNDEFINED!");
        if (namedKey) {
            return namedInputs[namedKey];
        }
        return namedInputs;
    };
    const copyAgentInfo = {
        name: "copyAgent",
        agent: copyAgent,
        mock: copyAgent,
        inputs: {
            anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
        },
        output: {
            anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
        },
        samples: [
            {
                inputs: { color: "red", model: "Model 3" },
                params: {},
                result: { color: "red", model: "Model 3" },
            },
            {
                inputs: { array: ["Hello World", "Discarded"] },
                params: {},
                result: { array: ["Hello World", "Discarded"] },
            },
            {
                inputs: { color: "red", model: "Model 3" },
                params: { namedKey: "color" },
                result: "red",
            },
        ],
        description: "Returns namedInputs",
        category: ["data"],
        author: "Receptron team",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const vanillaFetchAgent = async ({ namedInputs, params }) => {
        const { url, method, queryParams, headers, body } = namedInputs;
        const throwError = params.throwError ?? false;
        const url0 = new URL(url);
        const headers0 = headers ? { ...headers } : {};
        if (queryParams) {
            const params = new URLSearchParams(queryParams);
            url0.search = params.toString();
        }
        if (body) {
            headers0["Content-Type"] = "application/json";
        }
        const fetchOptions = {
            method: (method ?? body) ? "POST" : "GET",
            headers: new Headers(headers0),
            body: body ? JSON.stringify(body) : undefined,
        };
        if (params?.debug) {
            return {
                url: url0.toString(),
                method: fetchOptions.method,
                headers: headers0,
                body: fetchOptions.body,
            };
        }
        const response = await fetch(url0.toString(), fetchOptions);
        if (!response.ok) {
            const status = response.status;
            const type = params?.type ?? "json";
            const error = type === "json" ? await response.json() : await response.text();
            if (throwError) {
                throw new Error(`HTTP error: ${status}`);
            }
            return {
                onError: {
                    message: `HTTP error: ${status}`,
                    status,
                    error,
                },
            };
        }
        const result = await (async () => {
            const type = params?.type ?? "json";
            if (type === "json") {
                return await response.json();
            }
            else if (type === "text") {
                return response.text();
            }
            throw new Error(`Unknown Type! ${type}`);
        })();
        return result;
    };
    const vanillaFetchAgentInfo = {
        name: "vanillaFetchAgent",
        agent: vanillaFetchAgent,
        mock: vanillaFetchAgent,
        inputs: {
            type: "object",
            properties: {
                url: {
                    type: "string",
                    description: "baseurl",
                },
                method: {
                    type: "string",
                    description: "HTTP method",
                },
                headers: {
                    type: "object",
                    description: "HTTP headers",
                },
                quaryParams: {
                    type: "object",
                    description: "Query parameters",
                },
                body: {
                    anyOf: [{ type: "string" }, { type: "object" }],
                    description: "body",
                },
            },
            required: ["url"],
        },
        output: {
            type: "array",
        },
        samples: [
            {
                inputs: { url: "https://www.google.com", queryParams: { foo: "bar" }, headers: { "x-myHeader": "secret" } },
                params: {
                    debug: true,
                },
                result: {
                    method: "GET",
                    url: "https://www.google.com/?foo=bar",
                    headers: {
                        "x-myHeader": "secret",
                    },
                    body: undefined,
                },
            },
            {
                inputs: { url: "https://www.google.com", body: { foo: "bar" } },
                params: {
                    debug: true,
                },
                result: {
                    method: "POST",
                    url: "https://www.google.com/",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ foo: "bar" }),
                },
            },
        ],
        description: "Retrieves JSON data from the specified URL",
        category: ["service"],
        author: "Receptron",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const sleeperAgent = async ({ params, namedInputs }) => {
        await sleep(params?.duration ?? 10);
        return namedInputs;
    };
    const sleeperAgentInfo = {
        name: "sleeperAgent",
        agent: sleeperAgent,
        mock: sleeperAgent,
        samples: [
            {
                inputs: {},
                params: { duration: 1 },
                result: {},
            },
            {
                inputs: [{ a: 1 }, { b: 2 }],
                params: { duration: 1 },
                result: {},
            },
            {
                inputs: { array: [{ a: 1 }, { b: 2 }] },
                params: { duration: 1 },
                result: {
                    array: [{ a: 1 }, { b: 2 }],
                },
            },
        ],
        description: "sleeper Agent",
        category: ["sleeper"],
        author: "Receptron team",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const compare = (_array) => {
        if (_array.length !== 3) {
            throw new Error(`compare inputs length must must be 3`);
        }
        const array = _array.map((value) => {
            if (Array.isArray(value)) {
                return compare(value);
            }
            return value;
        });
        const [a, operator, b] = array;
        if (operator === "==") {
            return a === b;
        }
        if (operator === "!=") {
            return a !== b;
        }
        if (operator === ">") {
            return Number(a) > Number(b);
        }
        if (operator === ">=") {
            return Number(a) >= Number(b);
        }
        if (operator === "<") {
            return Number(a) < Number(b);
        }
        if (operator === "<=") {
            return Number(a) <= Number(b);
        }
        if (operator === "||") {
            return !!a || !!b;
        }
        if (operator === "&&") {
            return !!a && !!b;
        }
        if (operator === "XOR") {
            return !!a === !b;
        }
        throw new Error(`unknown compare operator`);
    };
    const compareAgent = async ({ namedInputs }) => {
        return compare(namedInputs.array);
    };
    const compareAgentInfo = {
        name: "compareAgent",
        agent: compareAgent,
        mock: compareAgent,
        inputs: {},
        output: {},
        samples: [
            {
                inputs: { array: ["abc", "==", "abc"] },
                params: {},
                result: true,
            },
            {
                inputs: { array: ["abc", "==", "abcd"] },
                params: {},
                result: false,
            },
            {
                inputs: { array: ["abc", "!=", "abc"] },
                params: {},
                result: false,
            },
            {
                inputs: { array: ["abc", "!=", "abcd"] },
                params: {},
                result: true,
            },
            {
                inputs: { array: ["10", ">", "5"] },
                params: {},
                result: true,
            },
            {
                inputs: { array: ["10", ">", "15"] },
                params: {},
                result: false,
            },
            {
                inputs: { array: [10, ">", 5] },
                params: {},
                result: true,
            },
            {
                inputs: { array: [10, ">", 15] },
                params: {},
                result: false,
            },
            {
                inputs: { array: ["10", ">=", "5"] },
                params: {},
                result: true,
            },
            {
                inputs: { array: ["10", ">=", "10"] },
                params: {},
                result: true,
            },
            {
                // 10
                inputs: { array: ["10", ">=", "19"] },
                params: {},
                result: false,
            },
            {
                inputs: { array: [10, ">=", 5] },
                params: {},
                result: true,
            },
            {
                inputs: { array: [10, ">=", 10] },
                params: {},
                result: true,
            },
            {
                inputs: { array: [10, ">=", 19] },
                params: {},
                result: false,
            },
            //
            {
                inputs: { array: ["10", "<", "5"] },
                params: {},
                result: false,
            },
            {
                inputs: { array: ["10", "<", "15"] },
                params: {},
                result: true,
            },
            {
                inputs: { array: [10, "<", 5] },
                params: {},
                result: false,
            },
            {
                inputs: { array: [10, "<", 15] },
                params: {},
                result: true,
            },
            {
                inputs: { array: ["10", "<=", "5"] },
                params: {},
                result: false,
            },
            {
                inputs: { array: ["10", "<=", "10"] },
                params: {},
                result: true,
            },
            {
                // 20
                inputs: { array: ["10", "<=", "19"] },
                params: {},
                result: true,
            },
            {
                inputs: { array: [10, "<=", 5] },
                params: {},
                result: false,
            },
            {
                inputs: { array: [10, "<=", 10] },
                params: {},
                result: true,
            },
            {
                inputs: { array: [10, "<=", 19] },
                params: {},
                result: true,
            },
            {
                inputs: { array: [true, "||", false] },
                params: {},
                result: true,
            },
            {
                inputs: { array: [false, "||", false] },
                params: {},
                result: false,
            },
            {
                inputs: { array: [true, "&&", false] },
                params: {},
                result: false,
            },
            {
                inputs: { array: [true, "&&", true] },
                params: {},
                result: true,
            },
            {
                inputs: { array: [true, "XOR", false] },
                params: {},
                result: true,
            },
            {
                inputs: { array: [false, "XOR", true] },
                params: {},
                result: true,
            },
            {
                inputs: { array: [false, "XOR", false] },
                params: {},
                result: false,
            },
            {
                inputs: { array: [true, "XOR", true] },
                params: {},
                result: false,
            },
            //
            {
                inputs: { array: [["aaa", "==", "aaa"], "||", ["aaa", "==", "bbb"]] },
                params: {},
                result: true,
            },
            {
                inputs: { array: [["aaa", "==", "aaa"], "&&", ["aaa", "==", "bbb"]] },
                params: {},
                result: false,
            },
            {
                inputs: { array: [[["aaa", "==", "aaa"], "&&", ["bbb", "==", "bbb"]], "||", ["aaa", "&&", "bbb"]] },
                params: {},
                result: true,
            },
        ],
        description: "compare",
        category: ["compare"],
        author: "Receptron",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    const defaultEmbeddingModel = "text-embedding-3-small";
    const OpenAI_embedding_API = "https://api.openai.com/v1/embeddings";
    // This agent retrieves embedding vectors for an array of strings using OpenAI's API
    //
    // Parameters:
    //   model: Specifies the model (default is "text-embedding-3-small")
    // NamedInputs:
    //   array: Array<string>
    //   item: string,
    // Result:
    //   contents: Array<Array<number>>
    //
    const stringEmbeddingsAgent = async ({ params, namedInputs }) => {
        const { array, item } = namedInputs;
        const sources = array ?? [item];
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("OPENAI_API_KEY key is not set in environment variables.");
        }
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        };
        const response = await fetch(OpenAI_embedding_API, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                input: sources,
                model: params?.model ?? defaultEmbeddingModel,
            }),
        });
        const jsonResponse = await response.json();
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const embeddings = jsonResponse.data.map((object) => {
            return object.embedding;
        });
        return embeddings;
    };
    const stringEmbeddingsAgentInfo = {
        name: "stringEmbeddingsAgent",
        agent: stringEmbeddingsAgent,
        mock: stringEmbeddingsAgent,
        samples: [],
        description: "Embeddings Agent",
        category: ["embedding"],
        author: "Receptron team",
        repository: "https://github.com/receptron/graphai",
        license: "MIT",
    };

    exports.arrayFlatAgent = arrayFlatAgentInfo;
    exports.arrayJoinAgent = arrayJoinAgentInfo;
    exports.compareAgent = compareAgentInfo;
    exports.copy2ArrayAgent = copy2ArrayAgentInfo;
    exports.copyAgent = copyAgentInfo;
    exports.copyMessageAgent = copyMessageAgentInfo;
    exports.countingAgent = countingAgentInfo;
    exports.dataSumTemplateAgent = dataSumTemplateAgentInfo;
    exports.dotProductAgent = dotProductAgentInfo;
    exports.echoAgent = echoAgentInfo;
    exports.jsonParserAgent = jsonParserAgentInfo;
    exports.mapAgent = mapAgentInfo;
    exports.mergeNodeIdAgent = mergeNodeIdAgentInfo;
    exports.nestedAgent = nestedAgentInfo;
    exports.popAgent = popAgentInfo;
    exports.propertyFilterAgent = propertyFilterAgentInfo;
    exports.pushAgent = pushAgentInfo;
    exports.shiftAgent = shiftAgentInfo;
    exports.sleeperAgent = sleeperAgentInfo;
    exports.sortByValuesAgent = sortByValuesAgentInfo;
    exports.streamMockAgent = streamMockAgentInfo;
    exports.stringEmbeddingsAgent = stringEmbeddingsAgentInfo;
    exports.stringSplitterAgent = stringSplitterAgentInfo;
    exports.stringTemplateAgent = stringTemplateAgentInfo;
    exports.totalAgent = totalAgentInfo;
    exports.vanillaFetchAgent = vanillaFetchAgentInfo;

}));
//# sourceMappingURL=bundle.umd.js.map
