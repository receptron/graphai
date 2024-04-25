import type { GraphAI, GraphData } from "@/graphai";

import {
  NodeDataParams,
  ResultData,
  DataSource,
  ComputedNodeData,
  StaticNodeData,
  NodeState,
  AgentFunctionContext,
  DefaultParamsType,
  DefaultInputData,
} from "@/type";
import { parseNodeName } from "@/utils/utils";
import { TransactionLog } from "@/transaction_log";

export class Node {
  public nodeId: string;
  public waitlist = new Set<string>(); // List of nodes which need data from this node.
  public state = NodeState.Waiting;
  public result: ResultData | undefined = undefined;

  protected graph: GraphAI;
  protected log: TransactionLog;

  constructor(nodeId: string, graph: GraphAI) {
    this.nodeId = nodeId;
    this.graph = graph;
    this.log = new TransactionLog(nodeId);
  }

  public asString() {
    return `${this.nodeId}: ${this.state} ${[...this.waitlist]}`;
  }

  // This method is called either as the result of computation (computed node) or
  // injection (static node).
  protected onSetResult() {
    this.waitlist.forEach((waitingNodeId) => {
      const waitingNode = this.graph.nodes[waitingNodeId];
      if (waitingNode.isComputedNode) {
        waitingNode.removePending(this.nodeId);
        waitingNode.pushQueueIfReadyAndRunning();
      }
    });
  }
}

export class ComputedNode extends Node {
  public graphId: string;
  public params: NodeDataParams; // Agent-specific parameters
  public nestedGraph?: GraphData;
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

  constructor(graphId: string, nodeId: string, forkIndex: number | undefined, data: ComputedNodeData, graph: GraphAI) {
    super(nodeId, graph);
    this.graphId = graphId;
    this.params = data.params ?? {};
    this.nestedGraph = data.graph;
    this.agentId = data.agentId;
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
    this.log.initForComputedNode(this);
  }

  public isReadyNode() {
    if (this.state === NodeState.Waiting && this.pendings.size === 0) {
      // Count the number of data actually available.
      // We care it only when this.anyInput is true.
      // Notice that this logic enables dynamic data-flows.
      const counter = this.inputs.reduce((count, nodeId) => {
        const source = this.sources[nodeId];
        const [result] = this.graph.resultsOf([source]);
        return result === undefined ? count : count + 1;
      }, 0);
      if (!this.anyInput || counter > 0) {
        return true;
      }
    }
    return false;
  }

  // This private method (only called while executing execute()) performs
  // the "retry" if specified. The transaction log must be updated before
  // callling this method.
  private retry(state: NodeState, error: Error) {
    this.state = state; // this.execute() will update to NodeState.Executing
    this.log.onError(this, this.graph, error.message);

    if (this.retryCount < this.retryLimit) {
      this.retryCount++;
      this.execute();
    } else {
      this.result = undefined;
      this.error = error;
      this.transactionId = undefined; // This is necessary for timeout case
      this.graph.onExecutionComplete(this);
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
  }

  public pushQueueIfReadyAndRunning() {
    if (this.graph.isRunning()) {
      this.graph.pushQueueIfReady(this);
    }
  }

  private isCurrentTransaction(transactionId: number) {
    return this.transactionId === transactionId;
  }

  // This private method (called only fro execute) checks if the callback from
  // the timer came before the completion of agent function call, record it
  // and attempt to retry (if specified).
  private executeTimeout(transactionId: number) {
    if (this.state === NodeState.Executing && this.isCurrentTransaction(transactionId)) {
      console.log(`-- ${this.nodeId}: timeout ${this.timeout}`);
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
    this.prepareExecute(transactionId, previousResults);

    if (this.timeout && this.timeout > 0) {
      setTimeout(() => {
        this.executeTimeout(transactionId);
      }, this.timeout);
    }

    try {
      const callback = this.graph.getCallback(this.agentId);
      const localLog: TransactionLog[] = [];
      const context: AgentFunctionContext<DefaultParamsType, DefaultInputData> = {
        params: this.params,
        inputs: previousResults,
        debugInfo: {
          nodeId: this.nodeId,
          retry: this.retryCount,
          forkIndex: this.forkIndex,
          verbose: this.graph.verbose,
        },
        log: localLog,
      };

      // NOTE: We use the existence of graph object in the agent-specific params to determine
      // if this is a nested agent or not.
      if (this.nestedGraph) {
        this.graph.taskManager.prepareForNesting();
        context.taskManager = this.graph.taskManager;
        context.graphData = this.nestedGraph;
        context.agents = this.graph.callbackDictonary;
      }

      const result = await callback(context);

      if (this.nestedGraph) {
        this.graph.taskManager.restoreAfterNesting();
      }

      if (!this.isCurrentTransaction(transactionId)) {
        // This condition happens when the agent function returns
        // after the timeout (either retried or not).
        console.log(`-- ${this.nodeId}: transactionId mismatch`);
        return;
      }

      this.state = NodeState.Completed;
      this.result = result;
      this.log.onComplete(this, this.graph, localLog);

      this.onSetResult();

      this.graph.onExecutionComplete(this);
    } catch (error) {
      this.errorProcess(error, transactionId);
    }
  }

  // This private method (called only by execute()) prepares the ComputedNode object
  // for execution, and create a new transaction to record it.
  private prepareExecute(transactionId: number, inputs: Array<ResultData>) {
    this.state = NodeState.Executing;
    this.log.beforeExecute(this, this.graph, transactionId, inputs);
    this.transactionId = transactionId;
  }

  // This private method (called only by execute) processes an error received from
  // the agent function. It records the error in the transaction log and handles
  // the retry if specified.
  private errorProcess(error: unknown, transactionId: number) {
    if (!this.isCurrentTransaction(transactionId)) {
      console.log(`-- ${this.nodeId}: transactionId mismatch(error)`);
      return;
    }

    if (error instanceof Error) {
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
    this.state = NodeState.Injected;
    this.result = value;
    this.log.onInjected(this, this.graph);
    this.onSetResult();
  }
}
