import { ResultData, NodeDataParams, NodeState } from "./type";
import type { GraphAI } from "./graphai";
import type { ComputedNode, StaticNode } from "./node";
export declare class TransactionLog {
    nodeId: string;
    state: NodeState;
    startTime?: number;
    endTime?: number;
    retryCount?: number;
    agentId?: string;
    params?: NodeDataParams;
    inputs?: Array<ResultData>;
    errorMessage?: string;
    result?: ResultData;
    log?: TransactionLog[];
    constructor(nodeId: string);
    initForComputedNode(node: ComputedNode): void;
    onInjected(node: StaticNode, graph: GraphAI): void;
    onComplete(node: ComputedNode, graph: GraphAI, localLog: TransactionLog[]): void;
    beforeExecute(node: ComputedNode, graph: GraphAI, transactionId: number, inputs: ResultData[]): void;
    onError(node: ComputedNode, graph: GraphAI, errorMessage: string): void;
}
