import { AssertionError } from "assert";

export enum NodeState {
  Waiting,
  Executing,
  Failed,
  TimedOut,
  Completed,
}

type NodeData = {
  inputs: undefined | Array<string>;
  params: any; // App-specific parameters
  retry: undefined | number;
  timeout: undefined | number; // msec
};

type GraphData = {
  nodes: Record<string, NodeData>;
};

type GraphCallback = (nodeId: string, transactionId: number, retry: number, params: Record<string, any>, payload: Record<string, any>) => void;

class Node {
  public key: string;
  public params: any; // App-specific parameters
  public inputs: Array<string>; // List of nodes this node needs data from.
  public pendings: Set<string>; // List of nodes this node is waiting data from.
  public waitlist: Set<string>; // List of nodes which need data from this node.
  public state: NodeState;
  public result: Record<string, any>;
  public retryLimit: number;
  public retryCount: number;
  public transactionId: undefined | number; // To reject callbacks from timed-out transactions
  public timeout: number; // msec

  constructor(key: string, data: NodeData) {
    this.key = key;
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
    return `${this.key}: ${this.state} ${[...this.waitlist]}`;
  }

  public complete(result: Record<string, any>, transactionId: number, graph: GraphAI) {
    if (this.transactionId !== transactionId) {
      console.log("****** tid mismatch");
      return;
    }
    this.state = NodeState.Completed;
    this.result = result;
    this.waitlist.forEach((key) => {
      const node = graph.nodes[key];
      node.removePending(this.key, graph);
    });
    graph.remove(this);
  }

  public reportError(result: Record<string, any>, transactionId: number, graph: GraphAI) {
    if (this.transactionId !== transactionId) {
      console.log("****** tid mismatch");
      return;
    }
    this.state = NodeState.Failed;
    this.result = result;
    this.retry(graph);
  }
  
  private retry(graph: GraphAI) {
    if (this.retryCount < this.retryLimit) {
      this.retryCount++;
      this.execute(graph);
    } else {
      graph.remove(this);
    }
  }

  public removePending(key: string, graph: GraphAI) {
    this.pendings.delete(key);
    this.executeIfReady(graph);
  }

  public payload(graph: GraphAI) {
    return this.inputs.reduce(
      (results, key) => {
        results[key] = graph.nodes[key].result;
        return results;
      },
      {} as Record<string, any>,
    );
  }

  public executeIfReady(graph: GraphAI) {
    if (this.pendings.size == 0) {
      graph.add(this);
      this.execute(graph);
    }
  }

  private execute(graph: GraphAI) {
    this.state = NodeState.Executing;
    const transactionId = Date.now();
    this.transactionId = transactionId;
    graph.callback(this.key, this.transactionId, this.retryCount, this.params, this.payload(graph));

    if (this.timeout > 0) {
      setTimeout(() => {
        if (this.state == NodeState.Executing && this.transactionId == transactionId) {
          console.log("*** timeout", this.timeout);
          this.state = NodeState.TimedOut;
          this.retry(graph);
        }
      }, this.timeout);
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
      (nodes, key) => {
        nodes[key] = new Node(key, data.nodes[key]);
        return nodes;
      },
      {} as Record<string, Node>,
    );

    // Generate the waitlist for each node
    Object.keys(this.nodes).forEach((key) => {
      const node = this.nodes[key];
      node.pendings.forEach((pending) => {
        const node2 = this.nodes[pending];
        node2.waitlist.add(key);
      });
    });
  }

  public asString() {
    return Object.keys(this.nodes)
      .map((key) => {
        return this.nodes[key].asString();
      })
      .join("\n");
  }

  public async run() {
    // Nodes without pending data should run immediately.
    Object.keys(this.nodes).forEach((key) => {
      const node = this.nodes[key];
      node.executeIfReady(this);
    });

    return new Promise((resolve, reject) => {
      this.onComplete = () => {
        const results = Object.keys(this.nodes).reduce(
          (results, key) => {
            results[key] = this.nodes[key].result;
            return results;
          },
          {} as Record<string, any>,
        );
        resolve(results);
      };
    });
  }

  public feed(key: string, tid: number, result: Record<string, any>) {
    const node = this.nodes[key];
    node.complete(result, tid, this);
  }

  public reportError(key: string, tid: number, result: Record<string, any>) {
    const node = this.nodes[key];
    node.reportError(result, tid, this);
  }

  public add(node: Node) {
    this.runningNodes.add(node.key);
  }

  public remove(node: Node) {
    this.runningNodes.delete(node.key);
    if (this.runningNodes.size == 0) {
      this.onComplete();
    }
  }
}
