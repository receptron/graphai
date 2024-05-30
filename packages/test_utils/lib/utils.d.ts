import { TransactionLog } from "graphai";
export declare const anonymization: (data: Record<string, any>) => any;
export declare const callbackLog: ({ nodeId, state, inputs, result, errorMessage }: TransactionLog) => void;
