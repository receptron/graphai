export declare enum NodeState {
    Waiting = 0,
    Executing = 1,
    Failed = 2,
    TimedOut = 3,
    Completed = 4
}
type ResultData = Record<string, any>;
export type NodeDataParams = Record<string, any>;
type NodeData = {
    inputs: undefined | Array<string>;
    params: NodeDataParams;
    retry: undefined | number;
    timeout: undefined | number;
};
type GraphData = {
    nodes: Record<string, NodeData>;
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
type GraphNodes = Record<string, Node>;
export declare class GraphAI {
    nodes: GraphNodes;
    callback: NodeExecute;
    private runningNodes;
    private onComplete;
    constructor(data: GraphData, callback: NodeExecute);
    asString(): string;
    run(): Promise<unknown>;
    addRunning(node: Node): void;
    removeRunning(node: Node): void;
}
export {};
