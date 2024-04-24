import { ComputedNode } from "./node";
export declare class TaskManager {
    private concurrency;
    private taskQueue;
    private runningNodes;
    constructor(concurrency: number);
    private dequeueTaskIfPossible;
    addTask(node: ComputedNode, callback: (node: ComputedNode) => void): void;
    onComplete(node: ComputedNode): void;
    prepareForNesting(): void;
    restoreAfterNesting(): void;
    getStatus(verbose?: boolean): {
        runningNodes?: string[] | undefined;
        queuedNodes?: string[] | undefined;
        concurrency: number;
        queue: number;
        running: number;
    };
}
