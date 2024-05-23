import { ComputedNode } from "@/node";
import { assert } from "@/utils/utils";

type TaskEntry = {
  node: ComputedNode;
  graphId: string;
  callback: (node: ComputedNode) => void;
};

// TaskManage object controls the concurrency of ComputedNode execution.
//
// NOTE: A TaskManager instance will be shared between parent graph and its children
// when nested agents are involved.
export class TaskManager {
  private concurrency: number;
  private taskQueue: Array<TaskEntry> = [];
  private runningNodes = new Set<ComputedNode>();

  constructor(concurrency: number) {
    this.concurrency = concurrency;
  }

  // This internal method dequeus a task from the task queue
  // and call the associated callback method, if the number of
  // running task is lower than the spcified limit.
  private dequeueTaskIfPossible() {
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
  public addTask(node: ComputedNode, graphId: string, callback: (node: ComputedNode) => void) {
    // Finder tasks in the queue, which has either the same or higher priority.
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
    this.dequeueTaskIfPossible();
  }

  // Node will call this method before it hands the task manager from the graph
  // to a nested agent. We need to make it sure that there is enough room to run
  // computed nodes inside the nested graph to avoid a deadlock.
  public prepareForNesting() {
    this.concurrency++;
  }

  public restoreAfterNesting() {
    this.concurrency--;
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
}
