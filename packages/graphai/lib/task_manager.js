"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManager = void 0;
const utils_1 = require("./utils/utils");
const assertPositiveInteger = (value, field) => {
    if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
        throw new Error(`TaskManager: ${field} must be a positive integer (got ${String(value)})`);
    }
    return value;
};
// Mirrors the strictness of validateConcurrencyConfig() so that direct
// `new TaskManager(...)` calls (e.g. tests, advanced consumers that bypass
// validateGraphData) cannot silently disable label enforcement with a
// malformed shape such as Map / Date / class instances / arrays.
const normalizeConcurrencyConfig = (config) => {
    if (typeof config === "number") {
        return { global: assertPositiveInteger(config, "concurrency"), labels: new Map() };
    }
    if (!(0, utils_1.isPlainObject)(config)) {
        throw new Error("TaskManager: concurrency must be a positive integer or a ConcurrencyConfig object");
    }
    const global = assertPositiveInteger(config.global, "concurrency.global");
    const labels = new Map();
    if (config.labels !== undefined) {
        if (!(0, utils_1.isPlainObject)(config.labels)) {
            throw new Error("TaskManager: concurrency.labels must be a plain object");
        }
        for (const [labelKey, labelValue] of Object.entries(config.labels)) {
            labels.set(labelKey, assertPositiveInteger(labelValue, `concurrency.labels.${labelKey}`));
        }
    }
    return { global, labels };
};
// TaskManage object controls the concurrency of ComputedNode execution.
//
// NOTE: A TaskManager instance will be shared between parent graph and its children
// when nested agents are involved.
class TaskManager {
    concurrency;
    labelLimits;
    runningByLabel = new Map();
    // Per-label bypass capacity granted to nested children. Keyed by parentGraphId
    // so that only tasks whose graphId differs from the parent (i.e. those running
    // inside the nested graph) can consume the extra slot. Unrelated siblings on
    // the same graphId as the parent are not affected.
    nestingBypassByLabel = new Map();
    taskQueue = [];
    runningNodes = new Set();
    constructor(config) {
        const normalized = normalizeConcurrencyConfig(config);
        this.concurrency = normalized.global;
        this.labelLimits = normalized.labels;
    }
    // Returns true if the task can run right now under both the global limit
    // and (if specified) its label-specific limit.
    canRun(task) {
        if (this.runningNodes.size >= this.concurrency) {
            return false;
        }
        const label = task.node.label;
        if (label === undefined) {
            return true;
        }
        const limit = this.labelLimits.get(label);
        if (limit === undefined) {
            return true;
        }
        const running = this.runningByLabel.get(label) ?? 0;
        if (running < limit) {
            return true;
        }
        // Bypass path: if a labeled parent has prepared for nesting and this task
        // belongs to a different graph (i.e. the nested graph), grant +1 per such
        // outstanding bump. Unrelated siblings on the parent's graphId do NOT get
        // this allowance, so the per-label cap is preserved for them.
        const bypass = this.nestingBypassByLabel.get(label);
        if (!bypass) {
            return false;
        }
        let extra = 0;
        for (const [parentGraphId, count] of bypass) {
            if (parentGraphId !== task.graphId) {
                extra += count;
            }
        }
        return running < limit + extra;
    }
    // Walk the queue (already sorted by priority desc) and dispatch the first task
    // whose label still has capacity. This is the "head-of-line skip" policy.
    dequeueTaskIfPossible() {
        if (this.runningNodes.size >= this.concurrency) {
            return;
        }
        for (let i = 0; i < this.taskQueue.length; i++) {
            const task = this.taskQueue[i];
            if (this.canRun(task)) {
                this.taskQueue.splice(i, 1);
                this.runningNodes.add(task.node);
                const label = task.node.label;
                if (label !== undefined) {
                    this.runningByLabel.set(label, (this.runningByLabel.get(label) ?? 0) + 1);
                }
                task.callback(task.node);
                return;
            }
        }
    }
    // Node will call this method to put itself in the execution queue.
    // We call the associated callback function when it is dequeued.
    addTask(node, graphId, callback) {
        // Find tasks in the queue, which has either the same or higher priority.
        const count = this.taskQueue.filter((task) => {
            return task.node.priority >= node.priority;
        }).length;
        (0, utils_1.assert)(count <= this.taskQueue.length, "TaskManager.addTask: Something is really wrong.");
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
        (0, utils_1.assert)(this.runningNodes.has(node), `TaskManager.onComplete node(${node.nodeId}) is not in list`);
        this.runningNodes.delete(node);
        const label = node.label;
        if (label !== undefined) {
            const running = this.runningByLabel.get(label) ?? 0;
            if (running <= 1) {
                this.runningByLabel.delete(label);
            }
            else {
                this.runningByLabel.set(label, running - 1);
            }
        }
        // A label slot may have just opened, so try to dispatch as many newly-eligible
        // tasks as possible (the freed label could allow several queued tasks to run if
        // the global limit is not yet reached).
        let progressed = true;
        while (progressed) {
            const before = this.runningNodes.size;
            this.dequeueTaskIfPossible();
            progressed = this.runningNodes.size > before;
        }
    }
    // Node will call this method before it hands the task manager from the graph
    // to a nested agent. We need to make it sure that there is enough room to run
    // computed nodes inside the nested graph to avoid a deadlock.
    //
    // When the parent carries a label that has a configured per-label limit,
    // a nested child sharing that label would otherwise stay queued forever
    // (parent waits for child, child blocked by parent's label slot). To avoid
    // this without widening the cap for unrelated siblings, we record a per-
    // parent-graphId bypass that canRun() applies only to tasks whose graphId
    // differs from the parent's.
    prepareForNesting(label, parentGraphId) {
        this.concurrency++;
        if (label !== undefined && parentGraphId !== undefined && this.labelLimits.has(label)) {
            let perParent = this.nestingBypassByLabel.get(label);
            if (!perParent) {
                perParent = new Map();
                this.nestingBypassByLabel.set(label, perParent);
            }
            perParent.set(parentGraphId, (perParent.get(parentGraphId) ?? 0) + 1);
        }
        // Both the global slot bump and the optional label bypass can free capacity
        // for already-queued tasks; drain the queue while progress is being made.
        let progressed = true;
        while (progressed) {
            const before = this.runningNodes.size;
            this.dequeueTaskIfPossible();
            progressed = this.runningNodes.size > before;
        }
    }
    restoreAfterNesting(label, parentGraphId) {
        this.concurrency--;
        if (label !== undefined && parentGraphId !== undefined) {
            const perParent = this.nestingBypassByLabel.get(label);
            if (perParent) {
                const next = (perParent.get(parentGraphId) ?? 0) - 1;
                if (next <= 0) {
                    perParent.delete(parentGraphId);
                }
                else {
                    perParent.set(parentGraphId, next);
                }
                if (perParent.size === 0) {
                    this.nestingBypassByLabel.delete(label);
                }
            }
        }
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
    reset() {
        this.taskQueue.length = 0;
        this.runningNodes.clear();
        this.runningByLabel.clear();
        this.nestingBypassByLabel.clear();
    }
}
exports.TaskManager = TaskManager;
