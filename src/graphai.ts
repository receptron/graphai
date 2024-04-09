export enum NodeState {
  Waiting,
  Executing,
  Failed,
  TimedOut,
  Completed,
  Injected,
  Dispatched,
}
type ResultData<ResultType = Record<string, any>> = ResultType | undefined;
type ResultDataDictonary<ResultType = Record<string, any>> = Record<string, ResultData<ResultType>>;

export type NodeDataParams<ParamsType = Record<string, any>> = ParamsType; // App-specific parameters

type NodeData = {
  inputs?: Array<string>;
  params: NodeDataParams;
  payloadMapping?: Record<string, string>
  retry?: number;
  timeout?: number; // msec
  functionName?: string;
  source?: boolean;
  dispatch?: Record<string, string>; // route to node
};

type GraphData = {
  nodes: Record<string, NodeData>;
  concurrency?: number;
};

type NodeExecuteContext<ParamsType, ResultType, PreviousResultType> = {
  nodeId: string;
  retry: number;
  params: NodeDataParams<ParamsType>;
  payload: ResultDataDictonary<PreviousResultType>;
};

export type TransactionLog = {
  nodeId: string;
  state: NodeState;
  startTime: number;
  endTime?: number;
  retryCount: number;
  error?: Error;
  result?: ResultData;
};

export type NodeExecute<ParamsType = Record<string, any>, ResultType = Record<string, any>, PreviousResultType = Record<string, any>> = (
  context: NodeExecuteContext<ParamsType, ResultType, PreviousResultType>,
) => Promise<ResultData<ResultType>>;

class Node {
  public nodeId: string;
  public params: NodeDataParams; // App-specific parameters
  public inputs: Array<string>; // List of nodes this node needs data from.
  public payloadMapping: Record<string, string>
  public pendings: Set<string>; // List of nodes this node is waiting data from.
  public waitlist = new Set<string>(); // List of nodes which need data from this node.
  public state = NodeState.Waiting;
  public functionName: string;
  public result: ResultData = undefined;
  public retryLimit: number;
  public retryCount: number = 0;
  public transactionId: undefined | number; // To reject callbacks from timed-out transactions
  public timeout: number; // msec
  public error: undefined | Error;
  public source: boolean;
  public dispatch?: Record<string, string>; // outputId to nodeId mapping

  private graph: GraphAI;

  constructor(nodeId: string, data: NodeData, graph: GraphAI) {
    this.nodeId = nodeId;
    this.inputs = data.inputs ?? [];
    this.payloadMapping = data.payloadMapping ?? {};
    this.pendings = new Set(this.inputs);
    this.params = data.params;
    this.functionName = data.functionName ?? "default";
    this.retryLimit = data.retry ?? 0;
    this.timeout = data.timeout ?? 0;
    this.source = data.source === true;
    this.dispatch = data.dispatch;
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
    if (this.graph.isRunning) {
      this.pushQueueIfReady();
    }
  }

  public payload() {
    return this.inputs.reduce((results: ResultDataDictonary, nodeId) => {
      if (this.payloadMapping && this.payloadMapping[nodeId]) {
        results[this.payloadMapping[nodeId]] = this.graph.nodes[nodeId].result;
      } else {
        results[nodeId] = this.graph.nodes[nodeId].result;
      }
      return results;
    }, {});
  }

  public pushQueueIfReady() {
    if (this.pendings.size === 0 && !this.source) {
      this.graph.pushQueue(this);
    }
  }

  public injectResult(result: ResultData) {
    if (this.source) {
      const log: TransactionLog = {
        nodeId: this.nodeId,
        retryCount: this.retryCount,
        state: NodeState.Injected,
        startTime: Date.now(),
      };
      log.endTime = log.startTime;
      this.graph.appendLog(log);
      this.setResult(result, NodeState.Injected);    
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
    const log: TransactionLog = {
      nodeId: this.nodeId,
      retryCount: this.retryCount,
      state: NodeState.Executing,
      startTime: Date.now(),
    };
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
          log.endTime = Date.now();
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
      const dispatch = this.dispatch;
      if (dispatch !== undefined) {
        Object.keys(result).forEach(outputId => {
          const nodeId = dispatch[outputId];
          this.graph.injectResult(nodeId, result[outputId]);
        });
        this.state = NodeState.Dispatched;
        this.graph.removeRunning(this);
        return;        
      }
      log.state = NodeState.Completed;
      log.endTime = Date.now();
      log.result = result;
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

type GraphNodes = Record<string, Node>;

type NodeExecuteDictonary = Record<string, NodeExecute<any, any, any>>;

const defaultConcurrency = 8;

export class GraphAI {
  public nodes: GraphNodes;
  public callbackDictonary: NodeExecuteDictonary;
  public isRunning = false;
  private runningNodes = new Set<string>();
  private nodeQueue: Array<Node> = [];
  private onComplete: () => void;
  private concurrency: number;
  private logs: Array<TransactionLog> = [];

  constructor(data: GraphData, callbackDictonary: NodeExecuteDictonary | NodeExecute<any, any, any>) {
    this.callbackDictonary = typeof callbackDictonary === "function" ? { default: callbackDictonary } : callbackDictonary;
    if (this.callbackDictonary["default"] === undefined) {
      throw new Error("No default function");
    }
    this.concurrency = data.concurrency ?? defaultConcurrency;
    this.onComplete = () => {
      console.error("-- SOMETHING IS WRONG: onComplete is called without run()");
    };
    this.nodes = Object.keys(data.nodes).reduce((nodes: GraphNodes, nodeId: string) => {
      nodes[nodeId] = new Node(nodeId, data.nodes[nodeId], this);
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
    return Object.keys(this.nodes).reduce((results: ResultDataDictonary, nodeId) => {
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
    if (this.isRunning) {
      console.error("-- Already Running");
    }
    this.isRunning = true;
    // Nodes without pending data should run immediately.
    Object.keys(this.nodes).forEach((nodeId) => {
      const node = this.nodes[nodeId];
      node.pushQueueIfReady();
    });

    return new Promise((resolve, reject) => {
      this.onComplete = () => {
        this.isRunning = false;
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

  private runNode(node: Node) {
    this.runningNodes.add(node.nodeId);
    node.execute();
  }

  public pushQueue(node: Node) {
    if (this.runningNodes.size < this.concurrency) {
      this.runNode(node);
    } else {
      this.nodeQueue.push(node);
    }
  }

  public removeRunning(node: Node) {
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

  public injectResult(nodeId: string, result: ResultData) {
    const node = this.nodes[nodeId];
    if (node) {
      node.injectResult(result);
    } else {
      console.error("-- Invalid nodeId", nodeId);
    }
  }
}
