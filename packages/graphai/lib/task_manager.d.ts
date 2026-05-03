import { ComputedNode } from "./node";
import { ConcurrencyConfig } from "./type";
export declare class TaskManager {
    private concurrency;
    private labelLimits;
    private runningByLabel;
    private nestingBypassByLabel;
    private taskQueue;
    private runningNodes;
    constructor(config: number | ConcurrencyConfig);
    private canRun;
    private dequeueTaskIfPossible;
    addTask(node: ComputedNode, graphId: string, callback: (node: ComputedNode) => void): void;
    isRunning(graphId: string): boolean;
    onComplete(node: ComputedNode): void;
    prepareForNesting(label?: string, parentGraphId?: string): void;
    restoreAfterNesting(label?: string, parentGraphId?: string): void;
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
    reset(): void;
}
