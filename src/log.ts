import { ResultData, NodeDataParams, NodeState } from "@/type";
import type { ComputedNode } from "@/node";

export class TransactionLog {
  public nodeId: string;
  public state: NodeState;
  public startTime?: number;
  public endTime?: number;
  public retryCount?: number;
  public agentId?: string;
  public params?: NodeDataParams;
  public inputs?: Array<ResultData>;
  public errorMessage?: string;
  public result?: ResultData;
  public log?: TransactionLog[];
  constructor(nodeId: string) {
    this.nodeId = nodeId;
    this.state = NodeState.Waiting;
  }

  public initForComputedNode(node: ComputedNode) {
    this.agentId = node.agentId;
    this.params = node.params;
  }
}

export const injectValueLog = (log: TransactionLog, value: ResultData) => {
  (log.state = NodeState.Injected), (log.endTime = Date.now());
  log.result = value;
};

export const executeLog = (log: TransactionLog, retryCount: number, transactionId: number, inputs: ResultData[]) => {
  log.state = NodeState.Executing;
  log.retryCount = retryCount > 0 ? retryCount : undefined;
  log.startTime = transactionId;
  log.inputs = inputs.length > 0 ? inputs : undefined;
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
