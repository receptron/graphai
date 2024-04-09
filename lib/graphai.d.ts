export declare enum NodeState {
    Waiting = 0,
    Executing = 1,
    Failed = 2,
    TimedOut = 3,
    Completed = 4,
    Injected = 5,
    Dispatched = 6
}
type ResultData<ResultType = Record<string, any>> = ResultType | undefined;
type ResultDataDictonary<ResultType = Record<string, any>> = Record<string, ResultData<ResultType>>;
export type NodeDataParams<ParamsType = Record<string, any>> = ParamsType;
type NodeData = {
    inputs?: Array<string>;
    params: NodeDataParams;
    payloadMapping?: Record<string, string>;
    retry?: number;
    timeout?: number;
    functionName?: string;
    source?: boolean;
    dispatch?: Record<string, string>;
};
type GraphData = {
    nodes: Record<string, NodeData>;
    concurrency?: number;
};
type NodeExecuteContext<ParamsType, ResultType, PreviousResultType> = {
    nodeId: string;
    retry: number;
    params: NodeDataParams<ParamsType>;
    payload: ResultDataDictonary<PreviousResultType>;
};
export type TransactionLog = {
    nodeId: string;
    state: NodeState;
    startTime: number;
    endTime?: number;
    retryCount: number;
    error?: Error;
    result?: ResultData;
};
export type NodeExecute<ParamsType = Record<string, any>, ResultType = Record<string, any>, PreviousResultType = Record<string, any>> = (context: NodeExecuteContext<ParamsType, ResultType, PreviousResultType>) => Promise<ResultData<ResultType>>;
declare class Node {
    nodeId: string;
    params: NodeDataParams;
    inputs: Array<string>;
    payloadMapping: Record<string, string>;
    pendings: Set<string>;
    waitlist: Set<string>;
    state: NodeState;
    functionName: string;
    result: ResultData;
    retryLimit: number;
    retryCount: number;
    transactionId: undefined | number;
    timeout: number;
    error: undefined | Error;
    source: boolean;
    dispatch?: Record<string, string>;
    private graph;
    constructor(nodeId: string, data: NodeData, graph: GraphAI);
    asString(): string;
    private retry;
    removePending(nodeId: string): void;
    payload(): ResultDataDictonary<Record<string, any>>;
    pushQueueIfReady(): void;
    injectResult(result: ResultData): void;
    private setResult;
    execute(): Promise<void>;
}
type GraphNodes = Record<string, Node>;
type NodeExecuteDictonary = Record<string, NodeExecute<any, any, any>>;
export declare class GraphAI {
    nodes: GraphNodes;
    callbackDictonary: NodeExecuteDictonary;
    isRunning: boolean;
    private runningNodes;
    private nodeQueue;
    private onComplete;
    private concurrency;
    private logs;
    constructor(data: GraphData, callbackDictonary: NodeExecuteDictonary | NodeExecute<any, any, any>);
    getCallback(functionName: string): NodeExecute<any, any, any>;
    asString(): string;
    results(): ResultDataDictonary<Record<string, any>>;
    errors(): Record<string, Error>;
    run(): Promise<unknown>;
    private runNode;
    pushQueue(node: Node): void;
    removeRunning(node: Node): void;
    appendLog(log: TransactionLog): void;
    transactionLogs(): TransactionLog[];
    injectResult(nodeId: string, result: ResultData): void;
}
export {};
