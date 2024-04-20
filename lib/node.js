"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticNode = exports.ComputedNode = exports.Node = void 0;
const type_1 = require("@/type");
const utils_1 = require("@/utils/utils");
const log_1 = require("@/log");
class Node {
    constructor(nodeId, graph) {
        this.waitlist = new Set(); // List of nodes which need data from this node.
        this.state = type_1.NodeState.Waiting;
        this.result = undefined;
        this.nodeId = nodeId;
        this.graph = graph;
        this.log = new log_1.TransactionLog(nodeId);
    }
    asString() {
        return `${this.nodeId}: ${this.state} ${[...this.waitlist]}`;
    }
    // This method is called either as the result of computation (computed node) or
    // injection (static node).
    setResult(result, state) {
        this.state = state;
        this.result = result;
        this.waitlist.forEach((waitingNodeId) => {
            const waitingNode = this.graph.nodes[waitingNodeId];
            if (waitingNode.isComputedNode) {
                waitingNode.removePending(this.nodeId);
            }
        });
    }
}
exports.Node = Node;
class ComputedNode extends Node {
    constructor(nodeId, forkIndex, data, graph) {
        super(nodeId, graph);
        this.retryCount = 0;
        this.sources = {}; // data sources.
        this.isStaticNode = false;
        this.isComputedNode = true;
        this.params = data.params ?? {};
        this.agentId = data.agentId ?? graph.agentId;
        this.retryLimit = data.retry ?? 0;
        this.timeout = data.timeout;
        this.anyInput = data.anyInput ?? false;
        this.sources = (data.inputs ?? []).reduce((tmp, input) => {
            const source = (0, utils_1.parseNodeName)(input);
            tmp[source.nodeId] = source;
            return tmp;
        }, {});
        this.inputs = Object.keys(this.sources);
        this.pendings = new Set(this.inputs);
        this.fork = data.fork;
        this.forkIndex = forkIndex;
        this.log.agentId = this.agentId;
        this.log.params = this.params;
    }
    pushQueueIfReady() {
        if (this.state === type_1.NodeState.Waiting && this.pendings.size === 0) {
            // Count the number of data actually available.
            // We care it only when this.anyInput is true.
            // Notice that this logic enables dynamic data-flows.
            const counter = () => {
                return this.inputs.reduce((count, nodeId) => {
                    const source = this.sources[nodeId];
                    const [result] = this.graph.resultsOf([source]);
                    return result === undefined ? count : count + 1;
                }, 0);
            };
            if (!this.anyInput || counter() > 0) {
                this.graph.pushQueue(this);
            }
        }
    }
    // This private method (only called while executing execute()) performs
    // the "retry" if specified. The transaction log must be updated before
    // callling this method.
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
    // This method is called when the data became available on one of nodes,
    // which this node needs data from.
    removePending(nodeId) {
        if (this.anyInput) {
            const [result] = this.graph.resultsOf([this.sources[nodeId]]);
            if (result) {
                this.pendings.clear();
            }
        }
        else {
            this.pendings.delete(nodeId);
        }
        if (this.graph.isRunning) {
            this.pushQueueIfReady();
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
            console.log(`-- ${this.nodeId}: timeout ${this.timeout}`);
            (0, log_1.timeoutLog)(this.log);
            this.graph.updateLog(this.log);
            this.retry(type_1.NodeState.TimedOut, Error("Timeout"));
        }
    }
    // This method is called when this computed node became ready to run.
    // It asynchronously calls the associated with agent function and set the result,
    // then it removes itself from the "running node" list of the graph.
    // Notice that setting the result of this node may make other nodes ready to run.
    async execute() {
        const previousResults = this.graph
            .resultsOf(this.inputs.map((input) => {
            return this.sources[input];
        }))
            .filter((result) => {
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
            const callback = this.graph.getCallback(this.agentId);
            const localLog = [];
            const result = await callback({
                nodeId: this.nodeId,
                retry: this.retryCount,
                params: this.params,
                inputs: previousResults,
                forkIndex: this.forkIndex,
                verbose: this.graph.verbose,
                agents: this.graph.callbackDictonary,
                log: localLog,
            });
            if (!this.isCurrentTransaction(transactionId)) {
                // This condition happens when the agent function returns
                // after the timeout (either retried or not).
                console.log(`-- ${this.nodeId}: transactionId mismatch`);
                return;
            }
            (0, log_1.callbackLog)(this.log, result, localLog);
            this.log.state = type_1.NodeState.Completed;
            this.graph.updateLog(this.log);
            this.setResult(result, type_1.NodeState.Completed);
            this.graph.removeRunning(this);
        }
        catch (error) {
            this.errorProcess(error, transactionId);
        }
    }
    // This private method (called only by execute()) prepares the ComputedNode object
    // for execution, and create a new transaction to record it.
    prepareExecute(transactionId, inputs) {
        (0, log_1.executeLog)(this.log, this.retryCount, transactionId, inputs);
        this.graph.appendLog(this.log);
        this.state = this.log.state;
        this.transactionId = transactionId;
    }
    // This private method (called only by execute) processes an error received from
    // the agent function. It records the error in the transaction log and handles
    // the retry if specified.
    errorProcess(error, transactionId) {
        if (!this.isCurrentTransaction(transactionId)) {
            console.log(`-- ${this.nodeId}: transactionId mismatch(error)`);
            return;
        }
        const isError = error instanceof Error;
        (0, log_1.errorLog)(this.log, isError ? error.message : "Unknown");
        this.graph.updateLog(this.log);
        if (isError) {
            this.retry(type_1.NodeState.Failed, error);
        }
        else {
            console.error(`-- ${this.nodeId}: Unexpecrted error was caught`);
            this.retry(type_1.NodeState.Failed, Error("Unknown"));
        }
    }
}
exports.ComputedNode = ComputedNode;
class StaticNode extends Node {
    constructor(nodeId, data, graph) {
        super(nodeId, graph);
        this.isStaticNode = true;
        this.isComputedNode = false;
        this.value = data.value;
        this.update = data.update;
    }
    injectValue(value) {
        const isUpdating = "endTime" in this.log;
        (0, log_1.injectValueLog)(this.log, value);
        if (isUpdating) {
            this.graph.updateLog(this.log);
        }
        else {
            this.graph.appendLog(this.log);
        }
        this.setResult(value, this.log.state);
    }
}
exports.StaticNode = StaticNode;
