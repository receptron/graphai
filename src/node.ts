import type { NodeDataParams, TransactionLog, ResultData, NodeData } from "@/type";

import type { GraphAI } from "@/graphai";

import { NodeState } from "@/type";

import { parseNodeName } from "@/utils/utils";

export class Node {
  public nodeId: string;
  public params: NodeDataParams; // Agent-specific parameters
  public inputs: Array<string>; // List of nodes this node needs data from.
  public inputProps: Record<string, string> = {}; // optional properties for input
  public pendings: Set<string>; // List of nodes this node is waiting data from.
  public waitlist = new Set<string>(); // List of nodes which need data from this node.
  public state = NodeState.Waiting;
  public agentId?: string;
  public fork?: number;
  public forkIndex?: number;
  public result: ResultData = undefined;
  public retryLimit: number;
  public retryCount: number = 0;
  public transactionId: undefined | number; // To reject callbacks from timed-out transactions
  public timeout?: number; // msec
  public error?: Error;
  public source: boolean;
  public outputs?: Record<string, string>; // Mapping from routeId to nodeId

  private graph: GraphAI;

  constructor(nodeId: string, forkIndex: number | undefined, data: NodeData, graph: GraphAI) {
    this.nodeId = nodeId;
    this.forkIndex = forkIndex;
    this.inputs = (data.inputs ?? []).map((input) => {
      const { sourceNodeId, propId } = parseNodeName(input);
      if (propId) {
        this.inputProps[sourceNodeId] = propId;
      }
      return sourceNodeId;
    });
    this.pendings = new Set(this.inputs);
    this.params = data.params ?? {};
    this.agentId = data.agentId ?? graph.agentId;
    this.fork = data.fork;
    this.retryLimit = data.retry ?? 0;
    this.timeout = data.timeout;
    this.source = this.agentId === undefined;
    this.outputs = data.outputs;
    this.graph = graph;
  }

  public asString() {
    return `${this.nodeId}: ${this.state} ${[...this.waitlist]}`;
  }

  private retry(state: NodeState, error: Error) {
    if (this.retryCount < this.retryLimit) {
      this.retryCount++;
      this.execute();
    } else {
      this.state = state;
      this.result = undefined;
      this.error = error;
      this.transactionId = undefined; // This is necessary for timeout case
      this.graph.removeRunning(this);
    }
  }

  public removePending(nodeId: string) {
    this.pendings.delete(nodeId);
    if (this.graph.isRunning) {
      this.pushQueueIfReady();
    }
  }

  public pushQueueIfReady() {
    if (this.pendings.size === 0 && !this.source) {
      // If input property is specified, we need to ensure that the property value exists.
      Object.keys(this.inputProps).forEach((nodeId) => {
        const [result] = this.graph.resultsOf([nodeId]);
        const propId = this.inputProps[nodeId];
        if (!result || !(propId in result)) {
          return;
        }
      });
      this.graph.pushQueue(this);
    }
  }

  public injectValue(value: ResultData) {
    if (this.source) {
      const log: TransactionLog = {
        nodeId: this.nodeId,
        retryCount: this.retryCount,
        state: NodeState.Injected,
        startTime: Date.now(),
        endTime: Date.now(),
        result: value,
      };
      this.graph.appendLog(log);
      this.setResult(value, NodeState.Injected);
    } else {
      console.error("- injectValue called on non-source node.", this.nodeId);
    }
  }

  private setResult(result: ResultData, state: NodeState) {
    this.state = state;
    this.result = result;
    this.waitlist.forEach((nodeId) => {
      const node = this.graph.nodes[nodeId];
      // Todo: Avoid running before Run()
      node.removePending(this.nodeId);
    });
  }

  public async execute() {
    const results = this.graph.resultsOf(this.inputs);
    this.inputs.forEach((nodeId, index) => {
      const propId = this.inputProps[nodeId];
      if (propId) {
        results[index] = results[index]![propId];
      }
    });
    const transactionId = Date.now();
    const log: TransactionLog = {
      nodeId: this.nodeId,
      retryCount: this.retryCount > 0 ? this.retryCount : undefined,
      state: NodeState.Executing,
      startTime: transactionId,
      agentId: this.agentId,
      params: this.params,
      inputs: results.length > 0 ? results : undefined,
    };
    this.graph.appendLog(log);
    this.state = NodeState.Executing;
    this.transactionId = transactionId;

    if (this.timeout && this.timeout > 0) {
      setTimeout(() => {
        if (this.state === NodeState.Executing && this.transactionId === transactionId) {
          console.log(`-- ${this.nodeId}: timeout ${this.timeout}`);
          log.errorMessage = "Timeout";
          log.state = NodeState.TimedOut;
          log.endTime = Date.now();
          this.retry(NodeState.TimedOut, Error("Timeout"));
        }
      }, this.timeout);
    }

    try {
      const callback = this.graph.getCallback(this.agentId);
      const localLog: TransactionLog[] = [];
      const result = await callback({
        nodeId: this.nodeId,
        retry: this.retryCount,
        params: this.params,
        inputs: results,
        forkIndex: this.forkIndex,
        verbose: this.graph.verbose,
        agents: this.graph.callbackDictonary,
        log: localLog,
      });
      if (this.transactionId !== transactionId) {
        console.log(`-- ${this.nodeId}: transactionId mismatch`);
        return;
      }

      log.endTime = Date.now();
      log.result = result;
      if (localLog.length > 0) {
        log.log = localLog;
      }

      const outputs = this.outputs;
      if (outputs !== undefined) {
        Object.keys(outputs).forEach((outputId) => {
          const nodeId = outputs[outputId];
          const value = result[outputId];
          if (value) {
            this.graph.injectValue(nodeId, value);
          } else {
            console.error("-- Invalid outputId", outputId, result);
          }
        });
        log.state = NodeState.Dispatched;
        this.state = NodeState.Dispatched;
        this.graph.removeRunning(this);
        return;
      }
      log.state = NodeState.Completed;
      this.setResult(result, NodeState.Completed);
      this.graph.removeRunning(this);
    } catch (error) {
      if (this.transactionId !== transactionId) {
        console.log(`-- ${this.nodeId}: transactionId mismatch(error)`);
        return;
      }
      log.state = NodeState.Failed;
      log.endTime = Date.now();
      if (error instanceof Error) {
        log.errorMessage = error.message;
        this.retry(NodeState.Failed, error);
      } else {
        console.error(`-- ${this.nodeId}: Unexpecrted error was caught`);
        log.errorMessage = "Unknown";
        this.retry(NodeState.Failed, Error("Unknown"));
      }
    }
  }
}
