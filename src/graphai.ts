export enum NodeState {
  Waiting = "waiting",
  Executing = "executing",
  Failed = "failed",
  TimedOut = "timed-out",
  Completed = "completed",
  Injected = "injected",
  Dispatched = "dispatched",
}
type ResultData<ResultType = Record<string, any>> = ResultType | undefined;
type ResultDataDictonary<ResultType = Record<string, any>> = Record<string, ResultData<ResultType>>;

export type NodeDataParams<ParamsType = Record<string, any>> = ParamsType; // Agent-specific parameters

type NodeData = {
  inputs?: Array<string>;
  params?: NodeDataParams;
  retry?: number;
  timeout?: number; // msec
  agentId?: string;
  fork?: number;
  source?: boolean;
  result?: ResultData; // preset result for source node.
  outputs?: Record<string, string>; // mapping from routeId to nodeId
};

export type GraphData = {
  nodes: Record<string, NodeData>;
  concurrency?: number;
  verbose?: boolean;
};

export type TransactionLog = {
  nodeId: string;
  state: NodeState;
  startTime: number;
  endTime?: number;
  retryCount: number;
  agentId?: string;
  params?: NodeDataParams;
  inputs?: Array<ResultData>;
  errorMessage?: string;
  result?: ResultData;
};

export type AgentFunctionContext<ParamsType, ResultType, PreviousResultType> = {
  nodeId: string;
  forkIndex?: number;
  retry: number;
  params: NodeDataParams<ParamsType>;
  inputs: Array<PreviousResultType>;
  verbose: boolean;
};

export type AgentFunction<ParamsType = Record<string, any>, ResultType = Record<string, any>, PreviousResultType = Record<string, any>> = (
  context: AgentFunctionContext<ParamsType, ResultType, PreviousResultType>,
) => Promise<ResultData<ResultType>>;

export type AgentFunctionDictonary = Record<string, AgentFunction<any, any, any>>;

class Node {
  public nodeId: string;
  public params: NodeDataParams; // Agent-specific parameters
  public inputs: Array<string>; // List of nodes this node needs data from.
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
    this.inputs = data.inputs ?? [];
    this.pendings = new Set(this.inputs);
    this.params = data.params ?? {};
    this.agentId = data.agentId;
    this.fork = data.fork;
    this.retryLimit = data.retry ?? 0;
    this.timeout = data.timeout;
    this.source = data.source === true;
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
        endTime: Date.now(),
        result,
      };
      this.graph.appendLog(log);
      this.setResult(result, NodeState.Injected);
    } else {
      console.error("- injectResult called on non-source node.", this.nodeId);
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
    const transactionId = Date.now();
    const log: TransactionLog = {
      nodeId: this.nodeId,
      retryCount: this.retryCount,
      state: NodeState.Executing,
      startTime: transactionId,
      agentId: this.agentId,
      params: this.params,
      inputs: results,
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
      const result = await callback({
        nodeId: this.nodeId,
        retry: this.retryCount,
        params: this.params,
        inputs: results,
        forkIndex: this.forkIndex,
        verbose: this.graph.verbose,
      });
      if (this.transactionId !== transactionId) {
        console.log(`-- ${this.nodeId}: transactionId mismatch`);
        return;
      }

      log.endTime = Date.now();
      log.result = result;

      const outputs = this.outputs;
      if (outputs !== undefined) {
        Object.keys(result).forEach((outputId) => {
          const nodeId = outputs[outputId];
          this.graph.injectResult(nodeId, result[outputId]);
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

type GraphNodes = Record<string, Node>;

const defaultConcurrency = 8;

export class GraphAI {
  public nodes: GraphNodes;
  public callbackDictonary: AgentFunctionDictonary;
  public isRunning = false;
  private runningNodes = new Set<string>();
  private nodeQueue: Array<Node> = [];
  private onComplete: () => void;
  private concurrency: number;
  public verbose: boolean;
  private logs: Array<TransactionLog> = [];

  constructor(data: GraphData, callbackDictonary: AgentFunctionDictonary | AgentFunction<any, any, any>) {
    this.callbackDictonary = typeof callbackDictonary === "function" ? { _default: callbackDictonary } : callbackDictonary;
    this.concurrency = data.concurrency ?? defaultConcurrency;
    this.verbose = data.verbose === true;
    this.onComplete = () => {
      console.error("-- SOMETHING IS WRONG: onComplete is called without run()");
    };
    const nodeId2forkedNodeIds: Record<string, string[]> = {};
    const forkedNodeId2Index: Record<string, number> = {};

    // Create node instances from data.nodes
    this.nodes = Object.keys(data.nodes).reduce((nodes: GraphNodes, nodeId: string) => {
      const fork = data.nodes[nodeId].fork;
      if (fork) {
        // For fork, change the nodeId and increase the node
        nodeId2forkedNodeIds[nodeId] = new Array(fork).fill(undefined).map((_, i) => {
          const forkedNodeId = `${nodeId}_${i}`;
          nodes[forkedNodeId] = new Node(forkedNodeId, i, data.nodes[nodeId], this);
          // Data for pending and waiting
          forkedNodeId2Index[forkedNodeId] = i;
          return forkedNodeId;
        });
      } else {
        nodes[nodeId] = new Node(nodeId, undefined, data.nodes[nodeId], this);
      }
      return nodes;
    }, {});

    // Generate the waitlist for each node, and update the pendings in case of forked node.
    Object.keys(this.nodes).forEach((nodeId) => {
      const node = this.nodes[nodeId];
      node.pendings.forEach((pending) => {
        // If the pending(previous) node is forking
        if (nodeId2forkedNodeIds[pending]) {
          //  update node.pending and pending(previous) node.wailtlist
          if (node.fork) {
            //  1:1 if current nodes are also forking.
            const newPendingId = nodeId2forkedNodeIds[pending][forkedNodeId2Index[nodeId]];
            this.nodes[newPendingId].waitlist.add(nodeId); // previousNode
            node.pendings.add(newPendingId);
          } else {
            //  1:n if current node is not forking.
            nodeId2forkedNodeIds[pending].forEach((newPendingId) => {
              this.nodes[newPendingId].waitlist.add(nodeId); // previousNode
              node.pendings.add(newPendingId);
            });
          }
          node.pendings.delete(pending);
        } else {
          this.nodes[pending].waitlist.add(nodeId); // previousNode
        }
      });
      node.inputs = Array.from(node.pendings); // for fork.
    });

    // If the result property is specified, inject it.
    // NOTE: This must be done at the end of this constructor
    Object.keys(data.nodes).forEach((nodeId) => {
      const result = data.nodes[nodeId].result;
      if (result) {
        this.injectResult(nodeId, result);
      }
    });
  }

  public getCallback(_agentId?: string) {
    const agentId = _agentId ?? "_default";
    if (this.callbackDictonary[agentId]) {
      return this.callbackDictonary[agentId];
    }
    throw new Error("No agent: " + agentId);
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

  public async run(): Promise<ResultDataDictonary> {
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

  public resultsOf(nodeIds: Array<string>) {
    return nodeIds.map((nodeId) => {
      return this.nodes[nodeId].result;
    });
  }
}
