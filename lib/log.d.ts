import { ResultData, TransactionLog, NodeDataParams } from "./type";
export declare const injectValueLog: (nodeId: string, retryCount: number, value: ResultData) => TransactionLog;
export declare const executeLog: (nodeId: string, retryCount: number, transactionId: number, agentId: string | undefined, params: NodeDataParams, results: ResultData[]) => TransactionLog;
export declare const timeoutLog: (log: TransactionLog) => void;
export declare const callbackLog: (log: TransactionLog, result: ResultData, localLog: TransactionLog[]) => void;
export declare const errorLog: (log: TransactionLog, errorMessage: string) => void;
