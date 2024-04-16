export declare enum NodeState {
    Waiting = "waiting",
    Executing = "executing",
    Failed = "failed",
    TimedOut = "timed-out",
    Completed = "completed",
    Injected = "injected",
    Dispatched = "dispatched"
}
type ResultData<ResultType = Record<string, any>> = ResultType | undefined;
type ResultDataDictonary<ResultType = Record<string, any>> = Record<string, ResultData<ResultType>>;
export type NodeDataParams<ParamsType = Record<string, any>> = ParamsType;
type NodeData = {
    inputs?: Array<string>;
    params?: NodeDataParams;
    retry?: number;
    timeout?: number;
    agentId?: string;
    fork?: number;
    source?: boolean;
    result?: ResultData;
    outputs?: Record<string, string>;
};
type LoopData = {
    count: number;
    assign?: Record<string, string>;
};
export type GraphData = {
    nodes: Record<string, NodeData>;
    concurrency?: number;
    loop?: LoopData;
    verbose?: boolean;
};
export type TransactionLog = {
    nodeId: string;
    state: NodeState;
    startTime: number;
    endTime?: number;
    retryCount?: number;
    agentId?: string;
    params?: NodeDataParams;
    inputs?: Array<ResultData>;
    errorMessage?: string;
    result?: ResultData;
    log?: TransactionLog[];
};
export type AgentFunctionContext<ParamsType, PreviousResultType> = {
    nodeId: string;
    forkIndex?: number;
    retry: number;
    params: NodeDataParams<ParamsType>;
    inputs: Array<PreviousResultType>;
    verbose: boolean;
    agents: CallbackDictonaryArgs;
    log: TransactionLog[];
};
export type AgentFunction<ParamsType = Record<string, any>, ResultType = Record<string, any>, PreviousResultType = Record<string, any>> = (context: AgentFunctionContext<ParamsType, PreviousResultType>) => Promise<ResultData<ResultType>>;
export type AgentFunctionDictonary = Record<string, AgentFunction<any, any, any>>;
declare class Node {
    nodeId: string;
    params: NodeDataParams;
    inputs: Array<string>;
    pendings: Set<string>;
    waitlist: Set<string>;
    state: NodeState;
    agentId?: string;
    fork?: number;
    forkIndex?: number;
    result: ResultData;
    retryLimit: number;
    retryCount: number;
    transactionId: undefined | number;
    timeout?: number;
    error?: Error;
    source: boolean;
    outputs?: Record<string, string>;
    private graph;
    constructor(nodeId: string, forkIndex: number | undefined, data: NodeData, graph: GraphAI);
    asString(): string;
    private retry;
    removePending(nodeId: string): void;
    pushQueueIfReady(): void;
    injectResult(result: ResultData): void;
    private setResult;
    execute(): Promise<void>;
}
type GraphNodes = Record<string, Node>;
export type CallbackDictonaryArgs = AgentFunctionDictonary | AgentFunction<any, any, any>;
export declare class GraphAI {
    private data;
    nodes: GraphNodes;
    callbackDictonary: AgentFunctionDictonary;
    isRunning: boolean;
    private runningNodes;
    private nodeQueue;
    private onComplete;
    private concurrency;
    private loop?;
    private repeatCount;
    verbose: boolean;
    private logs;
    private createNodes;
    private initializeNodes;
    constructor(data: GraphData, callbackDictonary: CallbackDictonaryArgs);
    getCallback(_agentId?: string): AgentFunction<any, any, any>;
    asString(): string;
    results(): ResultDataDictonary<Record<string, any>>;
    errors(): Record<string, Error>;
    private pushReadyNodesIntoQueue;
    run(): Promise<ResultDataDictonary>;
    private runNode;
    pushQueue(node: Node): void;
    removeRunning(node: Node): void;
    appendLog(log: TransactionLog): void;
    transactionLogs(): TransactionLog[];
    injectResult(nodeId: string, result: ResultData): void;
    resultsOf(nodeIds: Array<string>): ResultData<Record<string, any>>[];
}
export {};
