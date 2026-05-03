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
  // Per-label bypass capacity granted to nested children. Keyed by parentGraphId
  // so that only tasks whose graphId differs from the parent (i.e. those running
  // inside the nested graph) can consume the extra slot. Unrelated siblings on
  // the same graphId as the parent are not affected.
  private nestingBypassByLabel: Map<string, Map<string, number>> = new Map();
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
  // When the parent carries a label that has a configured per-label limit,
  // a nested child sharing that label would otherwise stay queued forever
  // (parent waits for child, child blocked by parent's label slot). To avoid
  // this without widening the cap for unrelated siblings, we record a per-
  // parent-graphId bypass that canRun() applies only to tasks whose graphId
  // differs from the parent's.
  public prepareForNesting(label?: string, parentGraphId?: string) {
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

  public restoreAfterNesting(label?: string, parentGraphId?: string) {
    this.concurrency--;
    if (label !== undefined && parentGraphId !== undefined) {
      const perParent = this.nestingBypassByLabel.get(label);
      if (perParent) {
        const next = (perParent.get(parentGraphId) ?? 0) - 1;
        if (next <= 0) {
          perParent.delete(parentGraphId);
        } else {
          perParent.set(parentGraphId, next);
        }
        if (perParent.size === 0) {
          this.nestingBypassByLabel.delete(label);
        }
      }
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
    this.nestingBypassByLabel.clear();
  }
}
