"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManager = void 0;
const utils_1 = require("./utils/utils");
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
        this.taskQueue.push({ node, graphId, callback });
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
        (0, utils_1.assert)(this.runningNodes.has(node), `TaskManager.onComplete node(${node.nodeId}) is not in list`);
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
        return {
            concurrency: this.concurrency,
            queue: this.taskQueue.length,
            running: this.runningNodes.size,
            ...(verbose
                ? {
                    runningNodes: Array.from(this.runningNodes).map((node) => node.nodeId),
                    queuedNodes: this.taskQueue.map((task) => task.node.nodeId),
                }
                : {}),
        };
    }
}
exports.TaskManager = TaskManager;
