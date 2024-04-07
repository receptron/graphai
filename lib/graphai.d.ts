export declare enum NodeState {
    Waiting = 0,
    Executing = 1,
    Failed = 2,
    TimedOut = 3,
    Completed = 4
}
type ResultData<ResultType = Record<string, any>> = ResultType | undefined;
type ResultDataDictonary<ResultType = Record<string, any>> = Record<string, ResultData<ResultType>>;
export type NodeDataParams = Record<string, any>;
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
export type NodeExecuteContext<ResultType> = {
    nodeId: string;
    retry: number;
    params: NodeDataParams;
    payload: ResultDataDictonary<ResultType>;
};
type NodeExecute<ResultType> = (context: NodeExecuteContext<ResultType>) => Promise<ResultData<ResultType>>;
declare class Node<ResultType = Record<string, any>> {
    nodeId: string;
    params: NodeDataParams;
    inputs: Array<string>;
    pendings: Set<string>;
    waitlist: Set<string>;
    state: NodeState;
    functionName: string;
    result: ResultData<ResultType>;
    retryLimit: number;
    retryCount: number;
    transactionId: undefined | number;
    timeout: number;
    private graph;
    constructor(nodeId: string, data: NodeData, graph: GraphAI<ResultType>);
    asString(): string;
    private retry;
    removePending(nodeId: string): void;
    payload(): ResultDataDictonary<ResultType>;
    pushQueueIfReady(): void;
    execute(): Promise<void>;
}
type GraphNodes<ResultType> = Record<string, Node<ResultType>>;
type NodeExecuteDictonary<ResultType> = Record<string, NodeExecute<ResultType>>;
export declare class GraphAI<ResultType = Record<string, any>> {
    nodes: GraphNodes<ResultType>;
    callbackDictonary: NodeExecuteDictonary<ResultType>;
    private runningNodes;
    private nodeQueue;
    private onComplete;
    private concurrency;
    constructor(data: GraphData, callbackDictonary: NodeExecuteDictonary<ResultType> | NodeExecute<ResultType>);
    getCallback(functionName: string): NodeExecute<ResultType>;
    asString(): string;
    run(): Promise<unknown>;
    private runNode;
    pushQueue(node: Node<ResultType>): void;
    removeRunning(node: Node<ResultType>): void;
}
export {};
