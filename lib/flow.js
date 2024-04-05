"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = exports.FlowCommand = exports.NodeState = void 0;
var NodeState;
(function (NodeState) {
    NodeState[NodeState["Waiting"] = 0] = "Waiting";
    NodeState[NodeState["Executing"] = 1] = "Executing";
    NodeState[NodeState["Failed"] = 2] = "Failed";
    NodeState[NodeState["Completed"] = 3] = "Completed";
})(NodeState || (exports.NodeState = NodeState = {}));
var FlowCommand;
(function (FlowCommand) {
    FlowCommand[FlowCommand["Log"] = 0] = "Log";
    FlowCommand[FlowCommand["Execute"] = 1] = "Execute";
    FlowCommand[FlowCommand["OnComplete"] = 2] = "OnComplete";
})(FlowCommand || (exports.FlowCommand = FlowCommand = {}));
class Node {
    constructor(key, data) {
        this.key = key;
        this.inputs = data.inputs ?? [];
        this.pendings = new Set(this.inputs);
        this.params = data.params;
        this.waitlist = new Set();
        this.state = NodeState.Waiting;
        this.result = {};
        this.retryLimit = data.retry ?? 0;
        this.retryCount = 0;
    }
    asString() {
        return `${this.key}: ${this.state} ${[...this.waitlist]}`;
    }
    complete(result, nodes, graph) {
        this.state = NodeState.Completed;
        this.result = result;
        this.waitlist.forEach(key => {
            const node = nodes[key];
            node.removePending(this.key, graph);
        });
        graph.remove(this);
    }
    reportError(result, nodes, graph) {
        this.state = NodeState.Failed;
        this.result = result;
        if (this.retryCount < this.retryLimit) {
            this.retryCount++;
            this.state = NodeState.Executing;
            graph.callback({ cmd: FlowCommand.Execute, node: this.key, params: this.params, retry: this.retryCount, payload: this.payload(graph) });
        }
        else {
            graph.remove(this);
        }
    }
    removePending(key, graph) {
        this.pendings.delete(key);
        this.executeIfReady(graph);
    }
    payload(graph) {
        const foo = {};
        return this.inputs.reduce((payload, key) => {
            payload[key] = graph.nodes[key].result;
            return payload;
        }, foo);
    }
    executeIfReady(graph) {
        if (this.pendings.size == 0) {
            this.state = NodeState.Executing;
            graph.add(this);
            graph.callback({ cmd: FlowCommand.Execute, node: this.key, params: this.params, retry: 0, payload: this.payload(graph) });
        }
    }
}
class Graph {
    constructor(data, callback) {
        this.callback = callback;
        this.runningNodes = new Set();
        const foo = {}; // HACK: Work around
        this.nodes = Object.keys(data.nodes).reduce((nodes, key) => {
            nodes[key] = new Node(key, data.nodes[key]);
            return nodes;
        }, foo);
        // Generate the waitlist for each node
        Object.keys(this.nodes).forEach(key => {
            const node = this.nodes[key];
            node.pendings.forEach(pending => {
                const node2 = this.nodes[pending];
                node2.waitlist.add(key);
            });
        });
    }
    asString() {
        return Object.keys(this.nodes).map((key) => { return this.nodes[key].asString(); }).join('\n');
    }
    run() {
        // Nodes without pending data should run immediately.
        Object.keys(this.nodes).forEach(key => {
            const node = this.nodes[key];
            node.executeIfReady(this);
        });
    }
    feed(key, result) {
        const node = this.nodes[key];
        node.complete(result, this.nodes, this);
    }
    reportError(key, result) {
        const node = this.nodes[key];
        node.reportError(result, this.nodes, this);
    }
    add(node) {
        this.runningNodes.add(node.key);
    }
    remove(node) {
        this.runningNodes.delete(node.key);
        if (this.runningNodes.size == 0) {
            this.callback({ cmd: FlowCommand.OnComplete });
        }
    }
}
exports.Graph = Graph;
