export declare enum NodeState {
    Waiting = 0,
    Executing = 1,
    Failed = 2,
    TimedOut = 3,
    Completed = 4
}
type ResultData = Record<string, any>;
type ResultDataDictonary = Record<string, ResultData>;
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
export type NodeExecuteContext = {
    nodeId: string;
    retry: number;
    params: NodeDataParams;
    payload: ResultData;
};
type NodeExecute = (context: NodeExecuteContext) => Promise<ResultData>;
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
    private graph;
    constructor(nodeId: string, data: NodeData, graph: GraphAI);
    asString(): string;
    private retry;
    removePending(nodeId: string): void;
    payload(): ResultDataDictonary;
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
    constructor(data: GraphData, callbackDictonary: NodeExecuteDictonary | NodeExecute);
    getCallback(functionName: string): NodeExecute;
    asString(): string;
    run(): Promise<unknown>;
    private runNode;
    pushQueue(node: Node): void;
    removeRunning(node: Node): void;
}
export {};
