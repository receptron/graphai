import { ResultData, TransactionLog, NodeState } from "@/type";

export const timeoutLog = (log: TransactionLog) => {
  log.errorMessage = "Timeout";
  log.state = NodeState.TimedOut;
  log.endTime = Date.now();
};

export const callbackLog = (log: TransactionLog, result: ResultData, localLog: TransactionLog[]) => {
  log.endTime = Date.now();
  log.result = result;
  if (localLog.length > 0) {
    log.log = localLog;
  }
};

export const errorLog = (log: TransactionLog, errorMessage: string) => {
  log.state = NodeState.Failed;
  log.endTime = Date.now();
  log.errorMessage = errorMessage;
};
