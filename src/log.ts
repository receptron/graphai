import { ResultData, NodeDataParams, NodeState } from "@/type";
import type { GraphAI } from "@/graphai";
import type { ComputedNode, StaticNode } from "@/node";

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

  public onInjected(node: StaticNode, graph: GraphAI) {
    const isUpdating = "endTime" in this;
    this.result = node.value;
    this.state = node.state;
    this.endTime = Date.now();
    if (isUpdating) {
      graph.updateLog(this);
    } else {
      graph.appendLog(this);
    }
  }

  public onComplete(node: ComputedNode, graph: GraphAI, localLog: TransactionLog[]) {
    this.result = node.result;
    this.state = node.state;
    this.endTime = Date.now();
    if (localLog.length > 0) {
      this.log = localLog;
    }
    graph.updateLog(this);
  }

  public beforeExecute(node: ComputedNode, graph: GraphAI, transactionId: number, inputs: ResultData[]) {
    this.state = node.state;
    this.retryCount = node.retryCount > 0 ? node.retryCount : undefined;
    this.startTime = transactionId;
    this.inputs = inputs.length > 0 ? inputs : undefined;
    graph.appendLog(this);
  }

  public onError(node: ComputedNode, graph: GraphAI, errorMessage: string) {
    this.state = node.state;
    this.errorMessage = errorMessage;
    this.endTime = Date.now();
    graph.updateLog(this);
  }
}
