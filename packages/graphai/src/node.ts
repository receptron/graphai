import type { GraphAI, GraphData } from "@/index";
import { strIntentionalError } from "@/utils/utils";
import { inputs2dataSources, dataSourceNodeIds } from "@/utils/nodeUtils";

import {
  NodeDataParams,
  ResultData,
  DataSource,
  ComputedNodeData,
  StaticNodeData,
  NodeState,
  AgentFunctionContext,
  AgentFunction,
  AgentFilterInfo,
  AgentFilterParams,
  DefaultParamsType,
  DefaultInputData,
  PassThrough,
  ConsoleElement,
} from "@/type";
import { parseNodeName, assert, isLogicallyTrue, isObject } from "@/utils/utils";
import { TransactionLog } from "@/transaction_log";
import { resultsOf } from "@/utils/result";

export class Node {
  public readonly nodeId: string;
  public readonly waitlist = new Set<string>(); // List of nodes which need data from this node.
  public state = NodeState.Waiting;
  public result: ResultData | undefined = undefined;

  protected graph: GraphAI;
  protected log: TransactionLog;
  protected console: ConsoleElement; // console output option (before and/or after)

  constructor(nodeId: string, graph: GraphAI) {
    this.nodeId = nodeId;
    this.graph = graph;
    this.log = new TransactionLog(nodeId);
    this.console = {};
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
        this.graph.pushQueueIfReadyAndRunning(waitingNode);
      }
    });
  }

  protected afterConsoleLog(result: ResultData) {
    if (this.console === false) {
      return;
    } else if (this.console === true || this.console.after === true) {
      console.log(typeof result === "string" ? result : JSON.stringify(result, null, 2));
    } else if (this.console.after) {
      if (isObject(this.console.after)) {
        console.log(
          JSON.stringify(resultsOf(this.console.after, { self: { result } as unknown as ComputedNode | StaticNode }, this.graph.propFunctions, true), null, 2),
        );
      } else {
        console.log(this.console.after);
      }
    }
  }
}

export class ComputedNode extends Node {
  public readonly graphId: string;
  public readonly isResult: boolean;
  public readonly params: NodeDataParams; // Agent-specific parameters
  private readonly filterParams: AgentFilterParams;
  public readonly nestedGraph?: GraphData | DataSource;
  private readonly config?: any;
  public readonly retryLimit: number;
  public retryCount: number = 0;
  private readonly agentId?: string;
  private readonly agentFunction?: AgentFunction<any, any, any>;
  public readonly timeout?: number; // msec
  public readonly priority: number;
  public error?: Error;
  public transactionId: undefined | number; // To reject callbacks from timed-out transactions
  private readonly passThrough?: PassThrough;

  public readonly anyInput: boolean; // any input makes this node ready
  public dataSources: DataSource[] = []; // no longer needed. This is for transaction log.
  private inputs?: Record<string, any>;
  private output?: Record<string, any>;
  public pendings: Set<string>; // List of nodes this node is waiting data from.
  private ifSource?: DataSource; // conditional execution
  private unlessSource?: DataSource; // conditional execution
  private defaultValue?: ResultData;
  private isSkip: boolean = false;

  public readonly isStaticNode = false;
  public readonly isComputedNode = true;

  constructor(graphId: string, nodeId: string, data: ComputedNodeData, graph: GraphAI) {
    super(nodeId, graph);
    this.graphId = graphId;
    this.params = data.params ?? {};
    this.console = data.console ?? {};
    this.filterParams = data.filterParams ?? {};
    this.passThrough = data.passThrough;
    this.retryLimit = data.retry ?? graph.retryLimit ?? 0;
    this.timeout = data.timeout;
    this.isResult = data.isResult ?? false;
    this.priority = data.priority ?? 0;

    assert(["function", "string"].includes(typeof data.agent), "agent must be either string or function");
    if (typeof data.agent === "string") {
      this.agentId = data.agent;
    } else {
      const agent = data.agent;
      this.agentFunction = async ({ namedInputs, params }) => agent(namedInputs, params);
    }
    (this.config = this.agentId ? ((this.graph.config ?? {})[this.agentId] ?? {}) : {}), (this.anyInput = data.anyInput ?? false);
    this.inputs = data.inputs;
    this.output = data.output;
    this.dataSources = [
      ...(data.inputs ? inputs2dataSources(data.inputs).flat(10) : []),
      ...(data.params ? inputs2dataSources(data.params).flat(10) : []),
      ...(this.agentId ? [parseNodeName(this.agentId)] : []),
    ];
    if (data.inputs && Array.isArray(data.inputs)) {
      throw new Error(`array inputs have been deprecated. nodeId: ${nodeId}: see https://github.com/receptron/graphai/blob/main/docs/NamedInputs.md`);
    }

    this.pendings = new Set(dataSourceNodeIds(this.dataSources));
    if (data.graph) {
      this.nestedGraph = typeof data.graph === "string" ? this.addPendingNode(data.graph) : data.graph;
    }
    if (data.graphLoader && graph.graphLoader) {
      this.nestedGraph = graph.graphLoader(data.graphLoader);
    }
    if (data.if) {
      this.ifSource = this.addPendingNode(data.if);
    }
    if (data.unless) {
      this.unlessSource = this.addPendingNode(data.unless);
    }
    if (data.defaultValue) {
      this.defaultValue = data.defaultValue;
    }
    this.isSkip = false;
    this.log.initForComputedNode(this, graph);
  }

  public getAgentId() {
    return this.agentId ?? "__custom__function"; // only for display purpose in the log.
  }

  private addPendingNode(nodeId: string) {
    const source = parseNodeName(nodeId);
    assert(!!source.nodeId, `Invalid data source ${nodeId}`);
    this.pendings.add(source.nodeId);
    return source;
  }

  public isReadyNode() {
    if (this.state !== NodeState.Waiting || this.pendings.size !== 0) {
      return false;
    }
    this.isSkip = !!(
      (this.ifSource && !isLogicallyTrue(this.graph.resultOf(this.ifSource))) ||
      (this.unlessSource && isLogicallyTrue(this.graph.resultOf(this.unlessSource)))
    );

    if (this.isSkip && this.defaultValue === undefined) {
      this.state = NodeState.Skipped;
      this.log.onSkipped(this, this.graph);
      return false;
    }
    return true;
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

  private checkDataAvailability() {
    return Object.values(this.graph.resultsOf(this.inputs))
      .flat()
      .some((result) => result !== undefined);
  }

  // This method is called right before the Graph add this node to the task manager.
  public beforeAddTask() {
    this.state = NodeState.Queued;
    this.log.beforeAddTask(this, this.graph);
  }

  // This method is called when the data became available on one of nodes,
  // which this node needs data from.
  public removePending(nodeId: string) {
    if (this.anyInput) {
      if (this.checkDataAvailability()) {
        this.pendings.clear();
      }
    } else {
      this.pendings.delete(nodeId);
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
      console.warn(`-- timeout ${this.timeout} with ${this.nodeId}`);
      this.retry(NodeState.TimedOut, Error("Timeout"));
    }
  }

  // Check if we need to apply this filter to this node or not.
  private shouldApplyAgentFilter(agentFilter: AgentFilterInfo, agentId?: string) {
    if (agentFilter.agentIds && Array.isArray(agentFilter.agentIds) && agentFilter.agentIds.length > 0) {
      if (agentId && agentFilter.agentIds.includes(agentId)) {
        return true;
      }
    }
    if (agentFilter.nodeIds && Array.isArray(agentFilter.nodeIds) && agentFilter.nodeIds.length > 0) {
      if (agentFilter.nodeIds.includes(this.nodeId)) {
        return true;
      }
    }
    return !agentFilter.agentIds && !agentFilter.nodeIds;
  }

  private agentFilterHandler(context: AgentFunctionContext, agentFunction: AgentFunction, agentId?: string): Promise<ResultData> {
    let index = 0;

    const next = (innerContext: AgentFunctionContext): Promise<ResultData> => {
      const agentFilter = this.graph.agentFilters[index++];
      if (agentFilter) {
        if (this.shouldApplyAgentFilter(agentFilter, agentId)) {
          if (agentFilter.filterParams) {
            innerContext.filterParams = { ...agentFilter.filterParams, ...innerContext.filterParams };
          }
          return agentFilter.agent(innerContext, next);
        }
        return next(innerContext);
      }
      return agentFunction(innerContext);
    };

    return next(context);
  }

  // This method is called when this computed node became ready to run.
  // It asynchronously calls the associated with agent function and set the result,
  // then it removes itself from the "running node" list of the graph.
  // Notice that setting the result of this node may make other nodes ready to run.
  public async execute() {
    if (this.isSkip) {
      this.afterExecute(this.defaultValue, []);
      return;
    }
    const previousResults = this.graph.resultsOf(this.inputs, this.anyInput);
    const agentId = this.agentId ? (this.graph.resultOf(parseNodeName(this.agentId)) as string) : this.agentId;
    const transactionId = Date.now();
    this.prepareExecute(transactionId, Object.values(previousResults));

    if (this.timeout && this.timeout > 0) {
      setTimeout(() => {
        this.executeTimeout(transactionId);
      }, this.timeout);
    }

    try {
      const agentFunction = this.agentFunction ?? this.graph.getAgentFunctionInfo(agentId).agent;
      const localLog: TransactionLog[] = [];
      const context = this.getContext(previousResults, localLog, agentId);

      // NOTE: We use the existence of graph object in the agent-specific params to determine
      // if this is a nested agent or not.
      if (this.nestedGraph) {
        this.graph.taskManager.prepareForNesting();
        context.forNestedGraph = {
          graphData: "nodes" in this.nestedGraph ? this.nestedGraph : (this.graph.resultOf(this.nestedGraph) as GraphData), // HACK: compiler work-around
          agents: this.graph.agentFunctionInfoDictionary,
          graphOptions: {
            agentFilters: this.graph.agentFilters,
            taskManager: this.graph.taskManager,
            bypassAgentIds: this.graph.bypassAgentIds,
            config: this.graph.config,
            graphLoader: this.graph.graphLoader,
          },
          onLogCallback: this.graph.onLogCallback,
        };
      }

      this.beforeConsoleLog(context);
      const result = await this.agentFilterHandler(context as AgentFunctionContext, agentFunction, agentId);
      this.afterConsoleLog(result);

      if (this.nestedGraph) {
        this.graph.taskManager.restoreAfterNesting();
      }

      if (!this.isCurrentTransaction(transactionId)) {
        // This condition happens when the agent function returns
        // after the timeout (either retried or not).
        console.log(`-- transactionId mismatch with ${this.nodeId} (probably timeout)`);
        return;
      }

      // after process
      this.afterExecute(result, localLog);
    } catch (error) {
      this.errorProcess(error, transactionId, previousResults);
    }
  }

  private afterExecute(result: ResultData, localLog: TransactionLog[]) {
    this.state = NodeState.Completed;
    this.result = this.getResult(result);
    if (this.output) {
      this.result = resultsOf(this.output, { self: this }, this.graph.propFunctions, true);
    }
    this.log.onComplete(this, this.graph, localLog);

    this.onSetResult();

    this.graph.onExecutionComplete(this);
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
  private errorProcess(error: unknown, transactionId: number, namedInputs: DefaultInputData) {
    if (error instanceof Error && error.message !== strIntentionalError) {
      console.error(`<-- NodeId: ${this.nodeId}, Agent: ${this.agentId}`);
      console.error({ namedInputs });
      console.error(error);
      console.error("-->");
    }
    if (!this.isCurrentTransaction(transactionId)) {
      console.warn(`-- transactionId mismatch with ${this.nodeId} (not timeout)`);
      return;
    }

    if (error instanceof Error) {
      this.retry(NodeState.Failed, error);
    } else {
      console.error(`-- NodeId: ${this.nodeId}: Unknown error was caught`);
      this.retry(NodeState.Failed, Error("Unknown"));
    }
  }

  private getContext(previousResults: Record<string, ResultData | undefined>, localLog: TransactionLog[], agentId?: string) {
    const context: AgentFunctionContext<DefaultParamsType, DefaultInputData | string | number | boolean | undefined> = {
      params: this.graph.resultsOf(this.params),
      namedInputs: previousResults,
      inputSchema: this.agentFunction ? undefined : this.graph.getAgentFunctionInfo(agentId)?.inputs,
      debugInfo: this.getDebugInfo(agentId),
      cacheType: this.agentFunction ? undefined : this.graph.getAgentFunctionInfo(agentId)?.cacheType,
      filterParams: this.filterParams,
      agentFilters: this.graph.agentFilters,
      config: this.graph.config,
      log: localLog,
    };
    return context;
  }

  private getResult(result: ResultData) {
    if (result && this.passThrough) {
      if (isObject(result) && !Array.isArray(result)) {
        return { ...result, ...this.passThrough };
      } else if (Array.isArray(result)) {
        return result.map((r) => (isObject(r) && !Array.isArray(r) ? { ...r, ...this.passThrough } : r));
      }
    }
    return result;
  }

  private getDebugInfo(agentId?: string) {
    return {
      nodeId: this.nodeId,
      agentId,
      retry: this.retryCount,
      verbose: this.graph.verbose,
      version: this.graph.version,
      isResult: this.isResult,
    };
  }

  private beforeConsoleLog(context: AgentFunctionContext<DefaultParamsType, string | number | boolean | DefaultInputData | undefined>) {
    if (this.console === false) {
      return;
    } else if (this.console === true || this.console.before === true) {
      console.log(JSON.stringify(context.namedInputs, null, 2));
    } else if (this.console.before) {
      console.log(this.console.before);
    }
  }
}

export class StaticNode extends Node {
  public value?: ResultData;
  public readonly update?: DataSource;
  public readonly isResult: boolean;
  public readonly isStaticNode = true;
  public readonly isComputedNode = false;

  constructor(nodeId: string, data: StaticNodeData, graph: GraphAI) {
    super(nodeId, graph);
    this.value = data.value;
    this.update = data.update ? parseNodeName(data.update) : undefined;
    this.isResult = data.isResult ?? false;
    this.console = data.console ?? {};
  }

  public injectValue(value: ResultData, injectFrom?: string) {
    this.state = NodeState.Injected;
    this.result = value;
    this.log.onInjected(this, this.graph, injectFrom);
    this.onSetResult();
  }

  public consoleLog() {
    this.afterConsoleLog(this.result);
  }
}

export type GraphNodes = Record<string, ComputedNode | StaticNode>;
