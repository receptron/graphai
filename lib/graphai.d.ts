export declare enum NodeState {
    Waiting = 0,
    Executing = 1,
    Failed = 2,
    TimedOut = 3,
    Completed = 4
}
type ResultData<ResultType = Record<string, any>> = ResultType | undefined;
type ResultDataDictonary<ResultType = Record<string, any>> = Record<string, ResultData<ResultType>>;
export type NodeDataParams<ParamsType = Record<string, any>> = ParamsType;
type NodeData = {
    inputs: undefined | Array<string>;
    params: NodeDataParams;
    retry: undefined | number;
    timeout: undefined | number;
    functionName: undefined | string;
};
type GraphData = {
    nodes: Record<string, NodeData>;
    concurrency: number;
};
type NodeExecuteContext<ResultType, ParamsType> = {
    nodeId: string;
    retry: number;
    params: NodeDataParams<ParamsType>;
    payload: ResultDataDictonary<ResultType>;
};
export type TransactionLog = {
    nodeId: string;
    state: NodeState;
    startTime: undefined | number;
    endTime: undefined | number;
    retryCount: number;
    error: undefined | Error;
    result?: ResultData;
};
export type NodeExecute<ResultType = Record<string, any>, ParamsType = Record<string, any>> = (context: NodeExecuteContext<ResultType, ParamsType>) => Promise<ResultData<ResultType>>;
declare class Node {
    nodeId: string;
    params: NodeDataParams;
    inputs: Array<string>;
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
    private graph;
    constructor(nodeId: string, data: NodeData, graph: GraphAI);
    asString(): string;
    private retry;
    removePending(nodeId: string): void;
    payload(): ResultDataDictonary<Record<string, any>>;
    pushQueueIfReady(): void;
    execute(): Promise<void>;
}
type GraphNodes = Record<string, Node>;
type NodeExecuteDictonary = Record<string, NodeExecute>;
export declare class GraphAI {
    nodes: GraphNodes;
    callbackDictonary: NodeExecuteDictonary;
    private runningNodes;
    private nodeQueue;
    private onComplete;
    private concurrency;
    private logs;
    constructor(data: GraphData, callbackDictonary: NodeExecuteDictonary | NodeExecute);
    getCallback(functionName: string): NodeExecute<Record<string, any>, Record<string, any>>;
    asString(): string;
    results(): ResultDataDictonary<Record<string, any>>;
    errors(): Record<string, Error>;
    run(): Promise<unknown>;
    private runNode;
    pushQueue(node: Node): void;
    removeRunning(node: Node): void;
    appendLog(log: TransactionLog): void;
    transactionLogs(): TransactionLog[];
}
export {};
