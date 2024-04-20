import { ResultData, NodeDataParams, NodeState } from "./type";
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
}
export declare const injectValueLog: (log: TransactionLog, value: ResultData) => void;
export declare const executeLog: (log: TransactionLog, retryCount: number, transactionId: number, inputs: ResultData[]) => void;
export declare const timeoutLog: (log: TransactionLog) => void;
export declare const callbackLog: (log: TransactionLog, result: ResultData, localLog: TransactionLog[]) => void;
export declare const errorLog: (log: TransactionLog, errorMessage: string) => void;
