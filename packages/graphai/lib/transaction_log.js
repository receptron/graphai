"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionLog = void 0;
const type_1 = require("./type");
const utils_1 = require("./utils/utils");
const nodeUtils_1 = require("./utils/nodeUtils");
class TransactionLog {
    constructor(nodeId) {
        this.nodeId = nodeId;
        this.state = type_1.NodeState.Waiting;
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
        this.resultKeys = (0, utils_1.debugResultKey)(this.agentId || "", node.result);
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
        this.inputs = (0, nodeUtils_1.dataSourceNodeIds)(node.dataSources);
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
exports.TransactionLog = TransactionLog;
