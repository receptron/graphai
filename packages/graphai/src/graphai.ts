import {
  AgentFunctionInfoDictionary,
  AgentFilterInfo,
  GraphData,
  DataSource,
  LoopData,
  ResultDataDictionary,
  ResultData,
  DefaultResultData,
  GraphOptions,
} from "@/type";
import { TransactionLog } from "@/transaction_log";

import { ComputedNode, StaticNode, GraphNodes } from "@/node";

import { resultsOf, resultOf, cleanResult } from "@/utils/result";
import { propFunction } from "@/utils/prop_function";
import { parseNodeName, assert, isLogicallyTrue } from "@/utils/utils";
import { getDataFromSource } from "@/utils/data_source";

import { validateGraphData } from "@/validator";
import { TaskManager } from "@/task_manager";

export const defaultConcurrency = 8;
export const graphDataLatestVersion = 0.5;

export class GraphAI {
  public readonly version: number;
  private readonly graphId: string;
  private readonly data: GraphData;
  private readonly loop?: LoopData;
  private readonly logs: Array<TransactionLog> = [];
  private readonly bypassAgentIds: string[];
  public readonly config?: Record<string, unknown> = {};
  public readonly agentFunctionInfoDictionary: AgentFunctionInfoDictionary;
  public readonly taskManager: TaskManager;
  public readonly agentFilters: AgentFilterInfo[];
  public readonly retryLimit?: number;

  public nodes: GraphNodes;
  public onLogCallback = (__log: TransactionLog, __isUpdate: boolean) => {};
  public verbose: boolean; // REVIEW: Do we need this?

  private onComplete: () => void;
  private repeatCount = 0;

  // This method is called when either the GraphAI obect was created,
  // or we are about to start n-th iteration (n>2).
  private createNodes(data: GraphData) {
    const nodes = Object.keys(data.nodes).reduce((_nodes: GraphNodes, nodeId: string) => {
      const nodeData = data.nodes[nodeId];
      if ("value" in nodeData) {
        _nodes[nodeId] = new StaticNode(nodeId, nodeData, this);
      } else if ("agent" in nodeData) {
        _nodes[nodeId] = new ComputedNode(this.graphId, nodeId, nodeData, this);
      } else {
        throw new Error("Unknown node type (neither value nor agent): " + nodeId);
      }
      return _nodes;
    }, {});

    // Generate the waitlist for each node.
    Object.keys(nodes).forEach((nodeId) => {
      const node = nodes[nodeId];
      if (node.isComputedNode) {
        node.pendings.forEach((pending) => {
          if (nodes[pending]) {
            nodes[pending].waitlist.add(nodeId); // previousNode
          } else {
            throw new Error(`createNode: invalid input ${pending} for node, ${nodeId}`);
          }
        });
      }
    });
    return nodes;
  }

  private getValueFromResults(source: DataSource, results: ResultDataDictionary<DefaultResultData>) {
    return getDataFromSource(source.nodeId ? results[source.nodeId] : undefined, source, [propFunction]);
  }

  // for static
  private initializeStaticNodes(enableConsoleLog: boolean = false) {
    // If the result property is specified, inject it.
    // If the previousResults exists (indicating we are in a loop),
    // process the update property (nodeId or nodeId.propId).
    Object.keys(this.data.nodes).forEach((nodeId) => {
      const node = this.nodes[nodeId];
      if (node?.isStaticNode) {
        const value = node?.value;
        if (value !== undefined) {
          this.injectValue(nodeId, value, nodeId);
        }
        if (enableConsoleLog) {
          node.consoleLog();
        }
      }
    });
  }

  private updateStaticNodes(previousResults?: ResultDataDictionary<DefaultResultData>, enableConsoleLog: boolean = false) {
    // If the result property is specified, inject it.
    // If the previousResults exists (indicating we are in a loop),
    // process the update property (nodeId or nodeId.propId).
    Object.keys(this.data.nodes).forEach((nodeId) => {
      const node = this.nodes[nodeId];
      if (node?.isStaticNode) {
        const update = node?.update;
        if (update && previousResults) {
          const result = this.getValueFromResults(update, previousResults);
          this.injectValue(nodeId, result, update.nodeId);
        }
        if (enableConsoleLog) {
          node.consoleLog();
        }
      }
    });
  }

  constructor(
    data: GraphData,
    agentFunctionInfoDictionary: AgentFunctionInfoDictionary,
    options: GraphOptions = {
      taskManager: undefined,
      agentFilters: [],
      bypassAgentIds: [],
      config: {},
    },
  ) {
    if (!data.version && !options.taskManager) {
      console.warn("------------ missing version number");
    }
    this.version = data.version ?? graphDataLatestVersion;
    if (this.version < graphDataLatestVersion) {
      console.warn(`------------ upgrade to ${graphDataLatestVersion}!`);
    }
    this.retryLimit = data.retry; // optional
    this.graphId = URL.createObjectURL(new Blob()).slice(-36);
    this.data = data;
    this.agentFunctionInfoDictionary = agentFunctionInfoDictionary;
    this.taskManager = options.taskManager ?? new TaskManager(data.concurrency ?? defaultConcurrency);
    this.agentFilters = options.agentFilters ?? [];
    this.bypassAgentIds = options.bypassAgentIds ?? [];
    this.config = options.config;
    this.loop = data.loop;
    this.verbose = data.verbose === true;
    this.onComplete = () => {
      throw new Error("SOMETHING IS WRONG: onComplete is called without run()");
    };

    validateGraphData(data, [...Object.keys(agentFunctionInfoDictionary), ...this.bypassAgentIds]);

    this.nodes = this.createNodes(data);
    this.initializeStaticNodes(true);
  }

  public getAgentFunctionInfo(agentId?: string) {
    if (agentId && this.agentFunctionInfoDictionary[agentId]) {
      return this.agentFunctionInfoDictionary[agentId];
    }
    if (agentId && this.bypassAgentIds.includes(agentId)) {
      return {
        agent: async () => {
          return null;
        },
        inputs: null,
      };
    }
    // We are not supposed to hit this error because the validator will catch it.
    throw new Error("No agent: " + agentId);
  }

  public asString() {
    return Object.values(this.nodes)
      .map((node) => node.asString())
      .join("\n");
  }

  // Public API
  public results<T = DefaultResultData>(all: boolean): ResultDataDictionary<T> {
    return Object.keys(this.nodes)
      .filter((nodeId) => all || this.nodes[nodeId].isResult)
      .reduce((results: ResultDataDictionary<T>, nodeId) => {
        const node = this.nodes[nodeId];
        if (node.result !== undefined) {
          results[nodeId] = node.result as T;
        }
        return results;
      }, {});
  }

  // Public API
  public errors(): Record<string, Error> {
    return Object.keys(this.nodes).reduce((errors: Record<string, Error>, nodeId) => {
      const node = this.nodes[nodeId];
      if (node.isComputedNode) {
        if (node.error !== undefined) {
          errors[nodeId] = node.error;
        }
      }
      return errors;
    }, {});
  }

  private pushReadyNodesIntoQueue() {
    // Nodes without pending data should run immediately.
    Object.keys(this.nodes).forEach((nodeId) => {
      const node = this.nodes[nodeId];
      if (node.isComputedNode) {
        this.pushQueueIfReady(node);
      }
    });
  }

  private pushQueueIfReady(node: ComputedNode) {
    if (node.isReadyNode()) {
      this.pushQueue(node);
    }
  }

  public pushQueueIfReadyAndRunning(node: ComputedNode) {
    if (this.isRunning()) {
      this.pushQueueIfReady(node);
    }
  }

  // for computed
  public pushQueue(node: ComputedNode) {
    node.beforeAddTask();

    this.taskManager.addTask(node, this.graphId, (_node) => {
      assert(node.nodeId === _node.nodeId, "GraphAI.pushQueue node mismatch");
      node.execute();
    });
  }

  // Public API
  public async run<T = DefaultResultData>(all: boolean = false): Promise<ResultDataDictionary<T>> {
    if (this.isRunning()) {
      throw new Error("This GraphUI instance is already running");
    }

    this.pushReadyNodesIntoQueue();

    if (!this.isRunning()) {
      console.warn("-- nothing to execute");
      return {};
    }

    return new Promise((resolve, reject) => {
      this.onComplete = () => {
        const errors = this.errors();
        const nodeIds = Object.keys(errors);
        if (nodeIds.length > 0) {
          reject(errors[nodeIds[0]]);
        } else {
          resolve(this.results(all));
        }
      };
    });
  }

  // Public only for testing
  public isRunning() {
    return this.taskManager.isRunning(this.graphId);
  }

  // callback from execute
  public onExecutionComplete(node: ComputedNode) {
    this.taskManager.onComplete(node);
    if (this.isRunning() || this.processLoopIfNecessary()) {
      return; // continue running
    }
    this.onComplete(); // Nothing to run. Finish it.
  }

  // Must be called only from onExecutionComplete righ after removeRunning
  // Check if there is any running computed nodes.
  // In case of no running computed note, start the another iteration if ncessary (loop)
  private processLoopIfNecessary() {
    this.repeatCount++;
    const loop = this.loop;
    if (!loop) {
      return false;
    }

    // We need to update static nodes, before checking the condition
    const previousResults = this.results(true); // results from previous loop
    this.updateStaticNodes(previousResults);

    if (loop.count === undefined || this.repeatCount < loop.count) {
      if (loop.while) {
        const source = parseNodeName(loop.while);
        const value = this.getValueFromResults(source, this.results(true));
        // NOTE: We treat an empty array as false.
        if (!isLogicallyTrue(value)) {
          return false; // while condition is not met
        }
      }
      this.nodes = this.createNodes(this.data);
      this.initializeStaticNodes();
      this.updateStaticNodes(previousResults, true);

      this.pushReadyNodesIntoQueue();
      return true; // Indicating that we are going to continue.
    }
    return false;
  }

  public setLoopLog(log: TransactionLog) {
    log.isLoop = !!this.loop;
    log.repeatCount = this.repeatCount;
  }

  public appendLog(log: TransactionLog) {
    this.logs.push(log);
    this.onLogCallback(log, false);
  }

  public updateLog(log: TransactionLog) {
    this.onLogCallback(log, true);
  }

  // Public API
  public transactionLogs() {
    return this.logs;
  }

  // Public API
  public injectValue(nodeId: string, value: ResultData, injectFrom?: string): void {
    const node = this.nodes[nodeId];
    if (node && node.isStaticNode) {
      node.injectValue(value, injectFrom);
    } else {
      throw new Error(`injectValue with Invalid nodeId, ${nodeId}`);
    }
  }

  public resultsOf(inputs?: Array<any> | Record<string, any>, anyInput: boolean = false) {
    const results = resultsOf(inputs ?? [], this.nodes, [propFunction]);
    if (anyInput) {
      return cleanResult(results);
    }
    return results;
  }
  public resultOf(source: DataSource) {
    return resultOf(source, this.nodes, [propFunction]);
  }
}
