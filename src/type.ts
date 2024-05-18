import type { TransactionLog } from "@/transaction_log";
import type { TaskManager } from "@/task_manager";

export enum NodeState {
  Waiting = "waiting",
  Queued = "queued",
  Executing = "executing",
  Failed = "failed",
  TimedOut = "timed-out",
  Completed = "completed",
  Injected = "injected",
  Skipped = "skipped",
}

export type DefaultResultData = Record<string, any> | string | number | boolean | Array<DefaultResultData>;
export type DefaultInputData = Record<string, any>;
export type ResultData<ResultType = DefaultResultData> = ResultType | undefined;
export type ResultDataDictonary<ResultType = DefaultResultData> = Record<string, ResultData<ResultType>>;

export type DefaultParamsType = Record<string, any>;
export type NodeDataParams<ParamsType = DefaultParamsType> = ParamsType; // Agent-specific parameters

export type DataSource = {
  nodeId?: string;
  value?: any;
  propIds?: string[];
};

export type StaticNodeData = {
  value: ResultData; // initial value for static node.
  update?: string; // nodeId (+.propId) to get value after a loop
  isResult?: boolean;
};
export type AgentNamelessFunction = (...param: any[]) => unknown;

export type AgentFilterParams = Record<string, any>;

export type ComputedNodeData = {
  agent: string | AgentNamelessFunction;
  inputs?: Array<any>;
  anyInput?: boolean; // any input makes this node ready
  params?: NodeDataParams;
  filterParams?: AgentFilterParams; // agent filter
  retry?: number;
  timeout?: number; // msec
  if?: string; // conditional execution
  unless?: string; // conditional execution
  graph?: GraphData;
  isResult?: boolean;
  priority?: number; // The default is 0.
  console?: Record<string, string | boolean>;
};

export type NodeData = StaticNodeData | ComputedNodeData;

export type LoopData = {
  count?: number;
  while?: string;
};

export type GraphData = {
  version?: number; // major version, 0.1, 0.2, ...
  nodes: Record<string, NodeData>;
  concurrency?: number;
  loop?: LoopData;
  verbose?: boolean;
  retry?: number;
};

export type AgentFunctionContext<ParamsType = DefaultParamsType, InputDataType = DefaultInputData> = {
  params: NodeDataParams<ParamsType>;
  inputs: Array<InputDataType>;
  debugInfo: {
    verbose: boolean;
    nodeId: string;
    retry: number;
    agentId?: string;
  };
  graphData?: GraphData | string; // nested graph
  agents?: AgentFunctionInfoDictonary; // for nested graph
  taskManager?: TaskManager; // for nested graph
  filterParams: AgentFilterParams; // agent filter
  agentFilters?: AgentFilterInfo[];
  log?: TransactionLog[];
};

export type AgentFunction<ParamsType = DefaultParamsType, ResultType = DefaultResultData, InputDataType = DefaultInputData> = (
  context: AgentFunctionContext<ParamsType, InputDataType>,
) => Promise<ResultData<ResultType>>;

export type AgentFilterFunction<ParamsType = DefaultParamsType, ResultType = DefaultResultData, InputDataType = DefaultInputData> = (
  context: AgentFunctionContext<ParamsType, InputDataType>,
  agent: AgentFunction,
) => Promise<ResultData<ResultType>>;

export type AgentFilterInfo = {
  name: string;
  agent: AgentFilterFunction;
  agentIds?: string[];
  nodeIds?: string[];
  filterParams?: AgentFilterParams;
};

// export type AgentFunctionDictonary = Record<string, AgentFunction<any, any, any>>;

export type AgentFunctionInfo = {
  name: string;
  agent: AgentFunction<any, any, any>;
  mock: AgentFunction<any, any, any>;
  samples: {
    inputs: any;
    params: DefaultParamsType;
    result: any;
    graph?: GraphData;
  }[];
  skipTest?: boolean;
  description: string;
  category: string[];
  author: string;
  repository: string;
  license: string;
};

export type AgentFunctionInfoDictonary = Record<string, AgentFunctionInfo>;
