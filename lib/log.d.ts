import { ResultData, TransactionLog } from "./type";
export declare const timeoutLog: (log: TransactionLog) => void;
export declare const callbackLog: (log: TransactionLog, result: ResultData, localLog: TransactionLog[]) => void;
export declare const errorLog: (log: TransactionLog, errorMessage: string) => void;
