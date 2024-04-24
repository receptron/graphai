import { ComputedNode } from "./node";
export declare class TaskManager {
    private concurrency;
    private taskQueue;
    private runningNodes;
    constructor(concurrency: number);
    private dequeueTaskIfPossible;
    addTask(node: ComputedNode, callback: (node: ComputedNode) => void): void;
    onComplete(node: ComputedNode): void;
}
