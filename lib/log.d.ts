import { ResultData, TransactionLog } from "./type";
export declare const injectValueLog: (log: TransactionLog, value: ResultData) => void;
export declare const executeLog: (log: TransactionLog, retryCount: number, transactionId: number, inputs: ResultData[]) => void;
export declare const timeoutLog: (log: TransactionLog) => void;
export declare const callbackLog: (log: TransactionLog, result: ResultData, localLog: TransactionLog[]) => void;
export declare const errorLog: (log: TransactionLog, errorMessage: string) => void;
