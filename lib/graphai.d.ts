export declare enum NodeState {
    Waiting = 0,
    Executing = 1,
    Failed = 2,
    TimedOut = 3,
    Completed = 4
}
type ResultData = Record<string, any>;
type NodeDataParams = Record<string, any>;
type NodeData = {
    inputs: undefined | Array<string>;
    params: NodeDataParams;
    retry: undefined | number;
    timeout: undefined | number;
};
type GraphData = {
    nodes: Record<string, NodeData>;
};
type GraphCallback = (nodeId: string, retry: number, params: NodeDataParams, payload: ResultData) => Promise<ResultData>;
declare class Node {
    nodeId: string;
    params: NodeDataParams;
    inputs: Array<string>;
    pendings: Set<string>;
    waitlist: Set<string>;
    state: NodeState;
    result: ResultData;
    retryLimit: number;
    retryCount: number;
    transactionId: undefined | number;
    timeout: number;
    constructor(nodeId: string, data: NodeData);
    asString(): string;
    private retry;
    removePending(nodeId: string, graph: GraphAI): void;
    payload(graph: GraphAI): ResultData;
    executeIfReady(graph: GraphAI): void;
    private execute;
}
export declare class GraphAI {
    nodes: Record<string, Node>;
    callback: GraphCallback;
    private runningNodes;
    private onComplete;
    constructor(data: GraphData, callback: GraphCallback);
    asString(): string;
    run(): Promise<unknown>;
    addRunning(node: Node): void;
    removeRunning(node: Node): void;
}
export {};
