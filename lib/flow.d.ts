export declare enum NodeState {
    Waiting = 0,
    Executing = 1,
    Failed = 2,
    Completed = 3
}
type NodeData = {
    inputs: undefined | Array<string>;
    params: any;
    retry: undefined | number;
};
type FlowData = {
    nodes: Record<string, NodeData>;
};
export declare enum FlowCommand {
    Log = 0,
    Execute = 1,
    OnComplete = 2
}
type FlowCallback = (params: Record<string, any>) => void;
declare class Node {
    key: string;
    inputs: Array<string>;
    pendings: Set<string>;
    params: any;
    waitlist: Set<string>;
    state: NodeState;
    result: Record<string, any>;
    retryLimit: number;
    retryCount: number;
    constructor(key: string, data: NodeData);
    asString(): string;
    complete(result: Record<string, any>, nodes: Record<string, Node>, graph: Graph): void;
    reportError(result: Record<string, any>, nodes: Record<string, Node>, graph: Graph): void;
    removePending(key: string, graph: Graph): void;
    payload(graph: Graph): Record<string, any>;
    executeIfReady(graph: Graph): void;
}
export declare class Graph {
    nodes: Record<string, Node>;
    callback: FlowCallback;
    private runningNodes;
    constructor(data: FlowData, callback: FlowCallback);
    asString(): string;
    run(): void;
    feed(key: string, result: Record<string, any>): void;
    reportError(key: string, result: Record<string, any>): void;
    add(node: Node): void;
    remove(node: Node): void;
}
export {};
