import { AssertionError } from "assert";

export enum NodeState {
  Waiting,
  Executing,
  Failed,
  TimedOut,
  Completed,
}
type ResultData = Record<string, any>;
type NodeDataParams = Record<string, any>; // App-specific parameters

type NodeData = {
  inputs: undefined | Array<string>;
  params: NodeDataParams;
  retry: undefined | number;
  timeout: undefined | number; // msec
};

type GraphData = {
  nodes: Record<string, NodeData>;
};

type GraphCallback = (nodeId: string, retry: number, params: NodeDataParams, payload: ResultData) => Promise<ResultData>;

class Node {
  public nodeId: string;
  public params: NodeDataParams; // App-specific parameters
  public inputs: Array<string>; // List of nodes this node needs data from.
  public pendings: Set<string>; // List of nodes this node is waiting data from.
  public waitlist: Set<string>; // List of nodes which need data from this node.
  public state: NodeState;
  public result: ResultData;
  public retryLimit: number;
  public retryCount: number;
  public transactionId: undefined | number; // To reject callbacks from timed-out transactions
  public timeout: number; // msec

  constructor(nodeId: string, data: NodeData) {
    this.nodeId = nodeId;
    this.inputs = data.inputs ?? [];
    this.pendings = new Set(this.inputs);
    this.params = data.params;
    this.waitlist = new Set<string>();
    this.state = NodeState.Waiting;
    this.result = {};
    this.retryLimit = data.retry ?? 0;
    this.retryCount = 0;
    this.timeout = data.timeout ?? 0;
  }

  public asString() {
    return `${this.nodeId}: ${this.state} ${[...this.waitlist]}`;
  }

  private retry(graph: GraphAI, state: NodeState, result: Record<string, any>) {
    if (this.retryCount < this.retryLimit) {
      this.retryCount++;
      this.execute(graph);
    } else {
      this.state = state;
      this.result = result;
      graph.removeRunning(this);
    }
  }

  public removePending(nodeId: string, graph: GraphAI) {
    this.pendings.delete(nodeId);
    this.executeIfReady(graph);
  }

  public payload(graph: GraphAI) {
    return this.inputs.reduce((results, nodeId) => {
      results[nodeId] = graph.nodes[nodeId].result;
      return results;
    }, {} as ResultData);
  }

  public executeIfReady(graph: GraphAI) {
    if (this.pendings.size == 0) {
      graph.addRunning(this);
      this.execute(graph);
    }
  }

  private async execute(graph: GraphAI) {
    this.state = NodeState.Executing;
    const transactionId = Date.now();
    this.transactionId = transactionId;

    if (this.timeout > 0) {
      setTimeout(() => {
        if (this.state == NodeState.Executing && this.transactionId == transactionId) {
          console.log("*** timeout", this.timeout);
          this.retry(graph, NodeState.TimedOut, {});
        }
      }, this.timeout);
    }

    try {
      const result = await graph.callback(this.nodeId, this.retryCount, this.params, this.payload(graph));
      if (this.transactionId !== transactionId) {
        console.log("****** tid mismatch (success)");
        return;
      }
      this.state = NodeState.Completed;
      this.result = result;
      this.waitlist.forEach((nodeId) => {
        const node = graph.nodes[nodeId];
        node.removePending(this.nodeId, graph);
      });
      graph.removeRunning(this);
    } catch (e) {
      if (this.transactionId !== transactionId) {
        console.log("****** tid mismatch (failed)");
        return;
      }
      this.retry(graph, NodeState.Failed, {});
    }
  }
}

export class GraphAI {
  public nodes: Record<string, Node>;
  public callback: GraphCallback;
  private runningNodes: Set<string>;
  private onComplete: () => void;

  constructor(data: GraphData, callback: GraphCallback) {
    this.callback = callback;
    this.runningNodes = new Set<string>();
    this.onComplete = () => {};
    this.nodes = Object.keys(data.nodes).reduce(
      (nodes, nodeId) => {
        nodes[nodeId] = new Node(nodeId, data.nodes[nodeId]);
        return nodes;
      },
      {} as Record<string, Node>,
    );

    // Generate the waitlist for each node
    Object.keys(this.nodes).forEach((nodeId) => {
      const node = this.nodes[nodeId];
      node.pendings.forEach((pending) => {
        const node2 = this.nodes[pending];
        node2.waitlist.add(nodeId);
      });
    });
  }

  public asString() {
    return Object.keys(this.nodes)
      .map((nodeId) => {
        return this.nodes[nodeId].asString();
      })
      .join("\n");
  }

  public async run() {
    // Nodes without pending data should run immediately.
    Object.keys(this.nodes).forEach((nodeId) => {
      const node = this.nodes[nodeId];
      node.executeIfReady(this);
    });

    return new Promise((resolve, reject) => {
      this.onComplete = () => {
        const results = Object.keys(this.nodes).reduce(
          (results, nodeId) => {
            results[nodeId] = this.nodes[nodeId].result;
            return results;
          },
          {} as Record<string, any>,
        );
        resolve(results);
      };
    });
  }

  public addRunning(node: Node) {
    this.runningNodes.add(node.nodeId);
  }

  public removeRunning(node: Node) {
    this.runningNodes.delete(node.nodeId);
    if (this.runningNodes.size == 0) {
      this.onComplete();
    }
  }
}
