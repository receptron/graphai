import { ComputedNode } from "./node";
type TaskManagerStatus = {
    concurrency: number;
    queue: number;
    running: number;
    runningNodes?: string[];
    queuedNodes?: string[];
};
export declare class TaskManager {
    private concurrency;
    private taskQueue;
    private runningNodes;
    constructor(concurrency: number);
    private dequeueTaskIfPossible;
    addTask(node: ComputedNode, callback: (node: ComputedNode) => void): void;
    onComplete(node: ComputedNode): void;
    prepareForNesting(): void;
    getStatus(verbose: boolean): TaskManagerStatus;
}
export {};
