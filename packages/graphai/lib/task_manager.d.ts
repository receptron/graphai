import { ComputedNode } from "./node";
export declare class TaskManager {
    private concurrency;
    private taskQueue;
    private runningNodes;
    constructor(concurrency: number);
    private dequeueTaskIfPossible;
    addTask(node: ComputedNode, graphId: string, callback: (node: ComputedNode) => void): void;
    isRunning(graphId: string): boolean;
    onComplete(node: ComputedNode): void;
    prepareForNesting(): void;
    restoreAfterNesting(): void;
    getStatus(verbose?: boolean): {
        runningNodes: string[];
        queuedNodes: string[];
        concurrency: number;
        queue: number;
        running: number;
    } | {
        runningNodes?: undefined;
        queuedNodes?: undefined;
        concurrency: number;
        queue: number;
        running: number;
    };
}
