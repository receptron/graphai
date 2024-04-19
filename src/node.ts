import type { NodeDataParams, TransactionLog, ResultData, DataSource, ComputedNodeData, StaticNodeData } from "@/type";

import type { GraphAI } from "@/graphai";

import { NodeState } from "@/type";

import { parseNodeName } from "@/utils/utils";
import { injectValueLog, executeLog, timeoutLog, callbackLog, errorLog } from "@/log";

export class Node {
  public nodeId: string;
  public waitlist = new Set<string>(); // List of nodes which need data from this node.
  public state = NodeState.Waiting;
  public result: ResultData = undefined;

  protected graph: GraphAI;

  constructor(nodeId: string, graph: GraphAI) {
    this.nodeId = nodeId;
    this.graph = graph;
  }

  public asString() {
    return `${this.nodeId}: ${this.state} ${[...this.waitlist]}`;
  }

  // This method is called either as the result of computation (computed node) or
  // injection (static node).
  protected setResult(result: ResultData, state: NodeState) {
    this.state = state;
    this.result = result;
    this.waitlist.forEach((waitingNodeId) => {
      const waitingNode = this.graph.nodes[waitingNodeId];
      if (waitingNode.isComputedNode) {
        waitingNode.removePending(this.nodeId);
      }
    });
  }
}

export class ComputedNode extends Node {
  public params: NodeDataParams; // Agent-specific parameters
  public retryLimit: number;
  public retryCount: number = 0;
  public agentId?: string;
  public timeout?: number; // msec
  public error?: Error;
  public fork?: number;
  public forkIndex?: number;
  public transactionId: undefined | number; // To reject callbacks from timed-out transactions

  public sources: Record<string, DataSource> = {}; // data sources.
  public anyInput: boolean; // any input makes this node ready
  public inputs: Array<string>; // List of nodes this node needs data from. The order is significant.
  public pendings: Set<string>; // List of nodes this node is waiting data from.

  public readonly isStaticNode = false;
  public readonly isComputedNode = true;

  constructor(nodeId: string, forkIndex: number | undefined, data: ComputedNodeData, graph: GraphAI) {
    super(nodeId, graph);
    this.params = data.params ?? {};
    this.agentId = data.agentId ?? graph.agentId;
    this.retryLimit = data.retry ?? 0;
    this.timeout = data.timeout;

    this.anyInput = data.anyInput ?? false;
    this.sources = (data.inputs ?? []).reduce((tmp: Record<string, DataSource>, input) => {
      const source = parseNodeName(input);
      tmp[source.nodeId] = source;
      return tmp;
    }, {});
    this.inputs = Object.keys(this.sources);
    this.pendings = new Set(this.inputs);
    this.fork = data.fork;
    this.forkIndex = forkIndex;
  }

  public pushQueueIfReady() {
    if (this.pendings.size === 0) {
      // If input property is specified, we need to ensure that the property value exists.
      const count = this.inputs.reduce((count, nodeId) => {
        const source = this.sources[nodeId];
        if (source.propId) {
          const [result] = this.graph.resultsOf([source]);
          if (!result) {
            return count;
          }
        }
        return count + 1;
      }, 0);

      if ((this.anyInput && count > 0) || count == this.inputs.length) {
        this.graph.pushQueue(this);
      }
    }
  }

  // This private method (only called while executing execute()) performs
  // the "retry" if specified. The transaction log must be updated before
  // callling this method.
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

  // This method is called when the data became available on one of nodes,
  // which this node needs data from.
  public removePending(nodeId: string) {
    if (this.anyInput) {
      const [result] = this.graph.resultsOf([this.sources[nodeId]]);
      if (result) {
        this.pendings.clear();
      }
    } else {
      this.pendings.delete(nodeId);
    }

    if (this.graph.isRunning) {
      this.pushQueueIfReady();
    }
  }

  private isCurrentTransaction(transactionId: number) {
    return this.transactionId === transactionId;
  }

  // This private method (called only fro execute) checks if the callback from
  // the timer came before the completion of agent function call, record it
  // and attempt to retry (if specified).
  private executeTimeout(transactionId: number, log: TransactionLog) {
    if (this.state === NodeState.Executing && this.isCurrentTransaction(transactionId)) {
      console.log(`-- ${this.nodeId}: timeout ${this.timeout}`);
      timeoutLog(log);
      this.graph.updateLog(log);
      this.retry(NodeState.TimedOut, Error("Timeout"));
    }
  }

  // This method is called when this computed node became ready to run.
  // It asynchronously calls the associated with agent function and set the result,
  // then it removes itself from the "running node" list of the graph.
  // Notice that setting the result of this node may make other nodes ready to run.
  public async execute() {
    const previousResults = this.graph
      .resultsOf(
        this.inputs.map((input) => {
          return this.sources[input];
        }),
      )
      .filter((result) => {
        // Remove undefined if anyInput flag is set.
        return !this.anyInput || result !== undefined;
      });
    const transactionId = Date.now();
    const log = this.prepareExecute(transactionId, previousResults);

    if (this.timeout && this.timeout > 0) {
      setTimeout(() => {
        this.executeTimeout(transactionId, log);
      }, this.timeout);
    }

    try {
      const callback = this.graph.getCallback(this.agentId);
      const localLog: TransactionLog[] = [];
      const result = await callback({
        nodeId: this.nodeId,
        retry: this.retryCount,
        params: this.params,
        inputs: previousResults,
        forkIndex: this.forkIndex,
        verbose: this.graph.verbose,
        agents: this.graph.callbackDictonary,
        log: localLog,
      });
      if (!this.isCurrentTransaction(transactionId)) {
        // This condition happens when the agent function returns
        // after the timeout (either retried or not).
        console.log(`-- ${this.nodeId}: transactionId mismatch`);
        return;
      }

      callbackLog(log, result, localLog);

      log.state = NodeState.Completed;
      this.graph.updateLog(log);

      this.setResult(result, NodeState.Completed);
      this.graph.removeRunning(this);
    } catch (error) {
      this.errorProcess(error, transactionId, log);
    }
  }

  // This private method (called only by execute()) prepares the ComputedNode object
  // for execution, and create a new transaction to record it.
  private prepareExecute(transactionId: number, previousResult: Array<ResultData>) {
    const log: TransactionLog = executeLog(this.nodeId, this.retryCount, transactionId, this.agentId, this.params, previousResult);
    this.graph.appendLog(log);
    this.state = NodeState.Executing;
    this.transactionId = transactionId;
    return log;
  }

  // This private method (called only by execute) processes an error received from
  // the agent function. It records the error in the transaction log and handles
  // the retry if specified.
  private errorProcess(error: unknown, transactionId: number, log: TransactionLog) {
    if (!this.isCurrentTransaction(transactionId)) {
      console.log(`-- ${this.nodeId}: transactionId mismatch(error)`);
      return;
    }
    const isError = error instanceof Error;
    errorLog(log, isError ? error.message : "Unknown");
    this.graph.updateLog(log);

    if (isError) {
      this.retry(NodeState.Failed, error);
    } else {
      console.error(`-- ${this.nodeId}: Unexpecrted error was caught`);
      this.retry(NodeState.Failed, Error("Unknown"));
    }
  }
}

export class StaticNode extends Node {
  public value?: ResultData;
  public update?: string;
  public readonly isStaticNode = true;
  public readonly isComputedNode = false;

  constructor(nodeId: string, data: StaticNodeData, graph: GraphAI) {
    super(nodeId, graph);
    this.value = data.value;
    this.update = data.update;
  }

  public injectValue(value: ResultData) {
    const log = injectValueLog(this.nodeId, value);
    this.graph.appendLog(log);
    this.setResult(value, NodeState.Injected);
  }
}
