import { NodeDataParams, ResultData, DataSource, ComputedNodeData, StaticNodeData } from "./type";
import type { GraphAI } from "./graphai";
import { NodeState } from "./type";
import { TransactionLog } from "./log";
export declare class Node {
    nodeId: string;
    waitlist: Set<string>;
    state: NodeState;
    result: ResultData;
    protected graph: GraphAI;
    protected log: TransactionLog;
    constructor(nodeId: string, graph: GraphAI);
    asString(): string;
    protected onSetResult(): void;
}
export declare class ComputedNode extends Node {
    params: NodeDataParams;
    retryLimit: number;
    retryCount: number;
    agentId?: string;
    timeout?: number;
    error?: Error;
    fork?: number;
    forkIndex?: number;
    transactionId: undefined | number;
    sources: Record<string, DataSource>;
    anyInput: boolean;
    inputs: Array<string>;
    pendings: Set<string>;
    readonly isStaticNode = false;
    readonly isComputedNode = true;
    constructor(nodeId: string, forkIndex: number | undefined, data: ComputedNodeData, graph: GraphAI);
    pushQueueIfReady(): void;
    private retry;
    removePending(nodeId: string): void;
    private isCurrentTransaction;
    private executeTimeout;
    execute(): Promise<void>;
    private prepareExecute;
    private errorProcess;
}
export declare class StaticNode extends Node {
    value?: ResultData;
    update?: string;
    readonly isStaticNode = true;
    readonly isComputedNode = false;
    constructor(nodeId: string, data: StaticNodeData, graph: GraphAI);
    injectValue(value: ResultData): void;
}
