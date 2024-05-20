import type { GraphAI, GraphData } from "./index";
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
    private readonly filterParams;
    private readonly dynamicParams;
    readonly nestedGraph?: GraphData | DataSource;
    readonly retryLimit: number;
    retryCount: number;
    private readonly agentId?;
    private readonly agentFunction?;
    readonly timeout?: number;
    readonly priority: number;
    error?: Error;
    transactionId: undefined | number;
    readonly anyInput: boolean;
    dataSources: Array<DataSource>;
    pendings: Set<string>;
    private ifSource?;
    private unlessSource?;
    private console;
    readonly isStaticNode = false;
    readonly isComputedNode = true;
    constructor(graphId: string, nodeId: string, data: ComputedNodeData, graph: GraphAI);
    getAgentId(): string;
    isReadyNode(): boolean;
    private retry;
    private checkDataAvailability;
    beforeAddTask(): void;
    removePending(nodeId: string): void;
    private isCurrentTransaction;
    private executeTimeout;
    private shouldApplyAgentFilter;
    private agentFilterHandler;
    execute(): Promise<void>;
    private prepareExecute;
    private errorProcess;
}
export declare class StaticNode extends Node {
    value?: ResultData;
    readonly update?: DataSource;
    readonly isResult: boolean;
    readonly isStaticNode = true;
    readonly isComputedNode = false;
    constructor(nodeId: string, data: StaticNodeData, graph: GraphAI);
    injectValue(value: ResultData, injectFrom?: string): void;
}
