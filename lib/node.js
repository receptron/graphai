"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
const type_1 = require("./type");
const utils_1 = require("./utils/utils");
class Node {
    constructor(nodeId, forkIndex, data, graph) {
        this.inputProps = {}; // optional properties for input
        this.waitlist = new Set(); // List of nodes which need data from this node.
        this.state = type_1.NodeState.Waiting;
        this.result = undefined;
        this.retryCount = 0;
        this.nodeId = nodeId;
        this.forkIndex = forkIndex;
        this.inputs = (data.inputs ?? []).map((input) => {
            const { sourceNodeId, propId } = (0, utils_1.parseNodeName)(input);
            if (propId) {
                this.inputProps[sourceNodeId] = propId;
            }
            return sourceNodeId;
        });
        this.pendings = new Set(this.inputs);
        this.params = data.params ?? {};
        this.agentId = data.agentId ?? graph.agentId;
        this.fork = data.fork;
        this.retryLimit = data.retry ?? 0;
        this.timeout = data.timeout;
        this.source = this.agentId === undefined;
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
            // If input property is specified, we need to ensure that the property value exists.
            Object.keys(this.inputProps).forEach((nodeId) => {
                const [result] = this.graph.resultsOf([nodeId]);
                const propId = this.inputProps[nodeId];
                if (!result || !(propId in result)) {
                    return;
                }
            });
            this.graph.pushQueue(this);
        }
    }
    injectValue(value) {
        if (this.source) {
            const log = {
                nodeId: this.nodeId,
                retryCount: this.retryCount,
                state: type_1.NodeState.Injected,
                startTime: Date.now(),
                endTime: Date.now(),
                result: value,
            };
            this.graph.appendLog(log);
            this.setResult(value, type_1.NodeState.Injected);
        }
        else {
            console.error("- injectValue called on non-source node.", this.nodeId);
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
        this.inputs.forEach((nodeId, index) => {
            const propId = this.inputProps[nodeId];
            if (propId) {
                results[index] = results[index][propId];
            }
        });
        const transactionId = Date.now();
        const log = {
            nodeId: this.nodeId,
            retryCount: this.retryCount > 0 ? this.retryCount : undefined,
            state: type_1.NodeState.Executing,
            startTime: transactionId,
            agentId: this.agentId,
            params: this.params,
            inputs: results.length > 0 ? results : undefined,
        };
        this.graph.appendLog(log);
        this.state = type_1.NodeState.Executing;
        this.transactionId = transactionId;
        if (this.timeout && this.timeout > 0) {
            setTimeout(() => {
                if (this.state === type_1.NodeState.Executing && this.transactionId === transactionId) {
                    console.log(`-- ${this.nodeId}: timeout ${this.timeout}`);
                    log.errorMessage = "Timeout";
                    log.state = type_1.NodeState.TimedOut;
                    log.endTime = Date.now();
                    this.retry(type_1.NodeState.TimedOut, Error("Timeout"));
                }
            }, this.timeout);
        }
        try {
            const callback = this.graph.getCallback(this.agentId);
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
                Object.keys(outputs).forEach((outputId) => {
                    const nodeId = outputs[outputId];
                    const value = result[outputId];
                    if (value) {
                        this.graph.injectValue(nodeId, value);
                    }
                    else {
                        console.error("-- Invalid outputId", outputId, result);
                    }
                });
                log.state = type_1.NodeState.Dispatched;
                this.state = type_1.NodeState.Dispatched;
                this.graph.removeRunning(this);
                return;
            }
            log.state = type_1.NodeState.Completed;
            this.setResult(result, type_1.NodeState.Completed);
            this.graph.removeRunning(this);
        }
        catch (error) {
            if (this.transactionId !== transactionId) {
                console.log(`-- ${this.nodeId}: transactionId mismatch(error)`);
                return;
            }
            log.state = type_1.NodeState.Failed;
            log.endTime = Date.now();
            if (error instanceof Error) {
                log.errorMessage = error.message;
                this.retry(type_1.NodeState.Failed, error);
            }
            else {
                console.error(`-- ${this.nodeId}: Unexpecrted error was caught`);
                log.errorMessage = "Unknown";
                this.retry(type_1.NodeState.Failed, Error("Unknown"));
            }
        }
    }
}
exports.Node = Node;
