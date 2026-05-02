import { ComputedNode } from "./node";
import { ConcurrencyConfig } from "./type";
import { assert, isObject } from "./utils/utils";

type TaskEntry = {
  node: ComputedNode;
  graphId: string;
  callback: (node: ComputedNode) => void;
};

const normalizeConcurrencyConfig = (config: number | ConcurrencyConfig): { global: number; labels: Map<string, number> } => {
  if (typeof config === "number") {
    return { global: config, labels: new Map() };
  }
  const labelsObj = isObject<number>(config.labels) ? config.labels : {};
  return { global: config.global, labels: new Map(Object.entries(labelsObj)) };
};

// TaskManage object controls the concurrency of ComputedNode execution.
//
// NOTE: A TaskManager instance will be shared between parent graph and its children
// when nested agents are involved.
export class TaskManager {
  private concurrency: number;
  private labelLimits: Map<string, number>;
  private runningByLabel: Map<string, number> = new Map();
  private taskQueue: Array<TaskEntry> = [];
  private runningNodes = new Set<ComputedNode>();

  constructor(config: number | ConcurrencyConfig) {
    const normalized = normalizeConcurrencyConfig(config);
    this.concurrency = normalized.global;
    this.labelLimits = normalized.labels;
  }

  // Returns true if the task can run right now under both the global limit
  // and (if specified) its label-specific limit.
  private canRun(task: TaskEntry): boolean {
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
    return running < limit;
  }

  // Walk the queue (already sorted by priority desc) and dispatch the first task
  // whose label still has capacity. This is the "head-of-line skip" policy.
  private dequeueTaskIfPossible() {
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
  public addTask(node: ComputedNode, graphId: string, callback: (node: ComputedNode) => void) {
    // Find tasks in the queue, which has either the same or higher priority.
    const count = this.taskQueue.filter((task) => {
      return task.node.priority >= node.priority;
    }).length;
    assert(count <= this.taskQueue.length, "TaskManager.addTask: Something is really wrong.");
    this.taskQueue.splice(count, 0, { node, graphId, callback });
    this.dequeueTaskIfPossible();
  }

  public isRunning(graphId: string) {
    const count = [...this.runningNodes].filter((node) => {
      return node.graphId == graphId;
    }).length;
    return count > 0 || Array.from(this.taskQueue).filter((data) => data.graphId === graphId).length > 0;
  }

  // Node MUST call this method once the execution of agent function is completed
  // either successfully or not.
  public onComplete(node: ComputedNode) {
    assert(this.runningNodes.has(node), `TaskManager.onComplete node(${node.nodeId}) is not in list`);
    this.runningNodes.delete(node);
    const label = node.label;
    if (label !== undefined) {
      const running = this.runningByLabel.get(label) ?? 0;
      if (running <= 1) {
        this.runningByLabel.delete(label);
      } else {
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
  // When the parent node carries a label that has a configured per-label limit,
  // bumping the global slot alone is not enough: a nested-graph child sharing
  // that label would still be blocked by the parent's own slot, leading to a
  // deadlock. Bump that label's limit too while we're nested.
  public prepareForNesting(label?: string) {
    this.concurrency++;
    if (label !== undefined && this.labelLimits.has(label)) {
      this.labelLimits.set(label, (this.labelLimits.get(label) ?? 0) + 1);
    }
  }

  public restoreAfterNesting(label?: string) {
    this.concurrency--;
    if (label !== undefined && this.labelLimits.has(label)) {
      this.labelLimits.set(label, (this.labelLimits.get(label) ?? 0) - 1);
    }
  }

  public getStatus(verbose: boolean = false) {
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

  public reset() {
    this.taskQueue.length = 0;
    this.runningNodes.clear();
    this.runningByLabel.clear();
  }
}
