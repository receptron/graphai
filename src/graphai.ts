import { AssertionError } from "assert";

export enum NodeState {
  Waiting,
  Executing,
  Failed,
  TimedOut,
  Completed,
}
type ResultData<ResultType = Record<string, any>> = ResultType | undefined;
type ResultDataDictonary<ResultType = Record<string, any>> = Record<string, ResultData<ResultType>>;

export type NodeDataParams = Record<string, any>; // App-specific parameters

type NodeData = {
  inputs: undefined | Array<string>;
  params: NodeDataParams;
  retry: undefined | number;
  timeout: undefined | number; // msec
  functionName: undefined | string;
};

type GraphData = {
  nodes: Record<string, NodeData>;
  concurrency: number;
};

export type NodeExecuteContext<ResultType> = {
  nodeId: string;
  retry: number;
  params: NodeDataParams;
  payload: ResultDataDictonary<ResultType>;
};

export type TransactionLog = {
  nodeId: string;
  state: NodeState;
  startTime: undefined | number;
  endTime: undefined | number;
  error: undefined | Error;
};

type NodeExecute<ResultType> = (context: NodeExecuteContext<ResultType>) => Promise<ResultData<ResultType>>;

class Node<ResultType = Record<string, any>> {
  public nodeId: string;
  public params: NodeDataParams; // App-specific parameters
  public inputs: Array<string>; // List of nodes this node needs data from.
  public pendings: Set<string>; // List of nodes this node is waiting data from.
  public waitlist: Set<string>; // List of nodes which need data from this node.
  public state: NodeState;
  public functionName: string;
  public result: ResultData<ResultType>;
  public retryLimit: number;
  public retryCount: number;
  public transactionId: undefined | number; // To reject callbacks from timed-out transactions
  public timeout: number; // msec
  public error: undefined | Error;

  private graph: GraphAI<ResultType>;

  constructor(nodeId: string, data: NodeData, graph: GraphAI<ResultType>) {
    this.nodeId = nodeId;
    this.inputs = data.inputs ?? [];
    this.pendings = new Set(this.inputs);
    this.params = data.params;
    this.waitlist = new Set<string>();
    this.state = NodeState.Waiting;
    this.functionName = data.functionName ?? "default";
    this.result = undefined;
    this.retryLimit = data.retry ?? 0;
    this.retryCount = 0;
    this.timeout = data.timeout ?? 0;

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
      this.transactionId = 0; // This is necessary for timeout case
      this.graph.removeRunning(this);
    }
  }

  public removePending(nodeId: string) {
    this.pendings.delete(nodeId);
    this.pushQueueIfReady();
  }

  public payload() {
    return this.inputs.reduce((results: ResultDataDictonary<ResultType>, nodeId) => {
      results[nodeId] = this.graph.nodes[nodeId].result;
      return results;
    }, {});
  }

  public pushQueueIfReady() {
    if (this.pendings.size === 0) {
      this.graph.pushQueue(this);
    }
  }

  public async execute() {
    const log: TransactionLog = { nodeId: this.nodeId, state:NodeState.Executing, startTime: Date.now(), endTime: undefined, error: undefined };
    this.graph.appendLog(log);
    this.state = NodeState.Executing;
    const transactionId = log.startTime;
    this.transactionId = transactionId;

    if (this.timeout > 0) {
      setTimeout(() => {
        if (this.state === NodeState.Executing && this.transactionId === transactionId) {
          console.log(`-- ${this.nodeId}: timeout ${this.timeout}`);
          log.error = Error("Timeout");
          log.state = NodeState.TimedOut;
          this.retry(NodeState.TimedOut, Error("Timeout"));
        }
      }, this.timeout);
    }

    try {
      const callback = this.graph.getCallback(this.functionName);
      const result = await callback({
        nodeId: this.nodeId,
        retry: this.retryCount,
        params: this.params,
        payload: this.payload(),
      });
      if (this.transactionId !== transactionId) {
        console.log(`-- ${this.nodeId}: transactionId mismatch`);
        return;
      }
      log.state = NodeState.Completed;
      log.endTime = Date.now();
      this.state = NodeState.Completed;
      this.result = result;
      this.waitlist.forEach((nodeId) => {
        const node = this.graph.nodes[nodeId];
        node.removePending(this.nodeId);
      });
      this.graph.removeRunning(this);
    } catch (error) {
      if (this.transactionId !== transactionId) {
        console.log(`-- ${this.nodeId}: transactionId mismatch(error)`);
        return;
      }
      log.state = NodeState.Failed;
      log.endTime = Date.now();
      if (error instanceof Error) {
        log.error = error;
        this.retry(NodeState.Failed, error);
      } else {
        console.error(`-- ${this.nodeId}: Unexpecrted error was caught`);
        log.error = Error("Unknown");
        this.retry(NodeState.Failed, Error("Unknown"));
      }
    }
  }
}

type GraphNodes<ResultType> = Record<string, Node<ResultType>>;

type NodeExecuteDictonary<ResultType> = Record<string, NodeExecute<ResultType>>;

const defaultConcurrency = 8;

export class GraphAI<ResultType = Record<string, any>> {
  public nodes: GraphNodes<ResultType>;
  public callbackDictonary: NodeExecuteDictonary<ResultType>;
  private runningNodes: Set<string>;
  private nodeQueue: Array<Node<ResultType>>;
  private onComplete: () => void;
  private concurrency: number;
  private logs: Array<TransactionLog> = [];

  constructor(data: GraphData, callbackDictonary: NodeExecuteDictonary<ResultType> | NodeExecute<ResultType>) {
    this.callbackDictonary = typeof callbackDictonary === "function" ? { default: callbackDictonary } : callbackDictonary;
    if (this.callbackDictonary["default"] === undefined) {
      throw new Error("No default function");
    }
    this.concurrency = data.concurrency ?? defaultConcurrency;
    this.runningNodes = new Set<string>();
    this.nodeQueue = [];
    this.onComplete = () => {};
    this.nodes = Object.keys(data.nodes).reduce((nodes: GraphNodes<ResultType>, nodeId: string) => {
      nodes[nodeId] = new Node<ResultType>(nodeId, data.nodes[nodeId], this);
      return nodes;
    }, {});

    // Generate the waitlist for each node
    Object.keys(this.nodes).forEach((nodeId) => {
      const node = this.nodes[nodeId];
      node.pendings.forEach((pending) => {
        const node2 = this.nodes[pending];
        node2.waitlist.add(nodeId);
      });
    });
  }

  public getCallback(functionName: string) {
    if (functionName && this.callbackDictonary[functionName]) {
      return this.callbackDictonary[functionName];
    }
    return this.callbackDictonary["default"];
  }

  public asString() {
    return Object.keys(this.nodes)
      .map((nodeId) => {
        return this.nodes[nodeId].asString();
      })
      .join("\n");
  }

  public results() {
    return Object.keys(this.nodes).reduce((results: ResultDataDictonary<ResultType>, nodeId) => {
      const node = this.nodes[nodeId];
      if (node.result !== undefined) {
        results[nodeId] = node.result;
      }
      return results;
    }, {});
  }

  public errors() {
    return Object.keys(this.nodes).reduce((errors: Record<string, Error>, nodeId) => {
      const node = this.nodes[nodeId];
      if (node.error !== undefined) {
        errors[nodeId] = node.error;
      }
      return errors;
    }, {});
  }

  public async run() {
    // Nodes without pending data should run immediately.
    Object.keys(this.nodes).forEach((nodeId) => {
      const node = this.nodes[nodeId];
      node.pushQueueIfReady();
    });

    return new Promise((resolve, reject) => {
      this.onComplete = () => {
        const errors = this.errors();
        const nodeIds = Object.keys(errors);
        if (nodeIds.length > 0) {
          reject(errors[nodeIds[0]]);
        } else {
          resolve(this.results());
        }
      };
    });
  }

  private runNode(node: Node<ResultType>) {
    this.runningNodes.add(node.nodeId);
    node.execute();
  }

  public pushQueue(node: Node<ResultType>) {
    if (this.runningNodes.size < this.concurrency) {
      this.runNode(node);
    } else {
      this.nodeQueue.push(node);
    }
  }

  public removeRunning(node: Node<ResultType>) {
    this.runningNodes.delete(node.nodeId);
    if (this.nodeQueue.length > 0) {
      const n = this.nodeQueue.shift();
      if (n) {
        this.runNode(n);
      }
    }
    if (this.runningNodes.size === 0) {
      this.onComplete();
    }
  }

  public appendLog(log: TransactionLog) {
    this.logs.push(log);
  }

  public transactionLogs() {
    return this.logs;
  }
}
