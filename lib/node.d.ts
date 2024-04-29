import type { GraphAI, GraphData } from "./graphai";
import { NodeDataParams, ResultData, DataSource, ComputedNodeData, StaticNodeData, NodeState } from "./type";
import { TransactionLog } from "./transaction_log";
export declare class Node {
    readonly nodeId: string;
    readonly waitlist: Set<string>;
    state: NodeState;
    result: ResultData | undefined;
    protected graph: GraphAI;
    protected log: TransactionLog;
    constructor(nodeId: string, graph: GraphAI);
    asString(): string;
    protected onSetResult(): void;
}
export declare class ComputedNode extends Node {
    readonly graphId: string;
    readonly isResult: boolean;
    readonly params: NodeDataParams;
    readonly nestedGraph?: GraphData;
    readonly retryLimit: number;
    retryCount: number;
    readonly agentId?: string;
    readonly timeout?: number;
    error?: Error;
    transactionId: undefined | number;
    readonly anyInput: boolean;
    dataSources: Array<DataSource>;
    pendings: Set<string>;
    readonly isStaticNode = false;
    readonly isComputedNode = true;
    constructor(graphId: string, nodeId: string, data: ComputedNodeData, graph: GraphAI);
    isReadyNode(): boolean;
    private retry;
    private checkDataAvailability;
    removePending(nodeId: string): void;
    private isCurrentTransaction;
    private executeTimeout;
    execute(): Promise<void>;
    private prepareExecute;
    private errorProcess;
}
export declare class StaticNode extends Node {
    value?: ResultData;
    readonly update?: string;
    readonly isResult: boolean;
    readonly isStaticNode = true;
    readonly isComputedNode = false;
    constructor(nodeId: string, data: StaticNodeData, graph: GraphAI);
    injectValue(value: ResultData, injectFrom?: string): void;
}
