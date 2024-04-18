import { ResultData, TransactionLog, NodeState, NodeDataParams } from "@/type";

export const injectValueLog = (nodeId: string, retryCount: number, value: ResultData) => {
  const log: TransactionLog = {
    nodeId,
    retryCount,
    state: NodeState.Injected,
    startTime: Date.now(),
    endTime: Date.now(),
    result: value,
  };
  return log;
};

export const executeLog = (
  nodeId: string,
  retryCount: number,
  transactionId: number,
  agentId: string | undefined,
  params: NodeDataParams,
  results: ResultData[],
) => {
  const log: TransactionLog = {
    nodeId,
    retryCount: retryCount > 0 ? retryCount : undefined,
    state: NodeState.Executing,
    startTime: transactionId,
    agentId,
    params,
    inputs: results.length > 0 ? results : undefined,
  };
  return log;
};

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
