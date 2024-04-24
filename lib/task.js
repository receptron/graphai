"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManager = void 0;
const utils_1 = require("./utils/utils");
class TaskManager {
    constructor(concurrency) {
        this.taskQueue = [];
        this.runningNodes = new Set();
        this.concurrency = concurrency;
    }
    dequeueTaskIfPossible() {
        if (this.runningNodes.size < this.concurrency) {
            const task = this.taskQueue.shift();
            if (task) {
                this.runningNodes.add(task.node);
                task.callback(task.node);
            }
        }
    }
    addTask(node, callback) {
        this.taskQueue.push({ node, callback });
        this.dequeueTaskIfPossible();
    }
    onComplete(node) {
        (0, utils_1.assert)(this.runningNodes.has(node), `TaskManager.onComplete node(${node.nodeId}) is not in list`);
        this.runningNodes.delete(node);
        this.dequeueTaskIfPossible();
    }
}
exports.TaskManager = TaskManager;
