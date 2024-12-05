import type { TransactionLog } from "@/transaction_log";
import type { TaskManager } from "@/task_manager";

export enum NodeState {
  Waiting = "waiting",
  Queued = "queued",
  Executing = "executing",
  ExecutingServer = "executing-server",
  Failed = "failed",
  TimedOut = "timed-out",
  Completed = "completed",
  Injected = "injected",
  Skipped = "skipped",
}

export type DefaultResultData = Record<string, any> | string | number | boolean | Array<DefaultResultData>;
export type DefaultInputData = Record<string, any>;
export type ResultData<ResultType = DefaultResultData> = ResultType | undefined;
export type ResultDataDictionary<ResultType = DefaultResultData> = Record<string, ResultData<ResultType>>;

export type DefaultParamsType = Record<string, any>;
export type NodeDataParams<ParamsType = DefaultParamsType> = ParamsType; // Agent-specific parameters

export type PassThrough = Record<string, any>;

export type DataSource = {
  nodeId?: string;
  value?: any;
  propIds?: string[];
};

export type StaticNodeData = {
  value: ResultData; // initial value for static node.
  update?: string; // nodeId (+.propId) to get value after a loop
  isResult?: boolean;
  console?: Record<string, string | boolean>;
};
export type AgentAnonymousFunction = (...params: any[]) => unknown;

export type AgentFilterParams = Record<string, any>;

export type GraphDataLoaderOption = { fileName: string; option?: any };

export type ComputedNodeData = {
  agent: string | AgentAnonymousFunction;
  inputs?: Array<any> | Record<string, any>;
  anyInput?: boolean; // any input makes this node ready
  params?: NodeDataParams;
  filterParams?: AgentFilterParams; // agent filter
  retry?: number;
  timeout?: number; // msec
  if?: string; // conditional execution
  unless?: string; // conditional execution
  graph?: GraphData | string;
  graphLoader?: GraphDataLoaderOption;
  isResult?: boolean;
  priority?: number; // The default is 0.
  passThrough?: PassThrough; // data that pass trough to result
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
  metadata?: any; // Stores information about GraphData. GraphAI itself is not used this data.
};

export type GraphDataLoader = (loaderOption: GraphDataLoaderOption) => GraphData;

export type GraphOptions = {
  agentFilters?: AgentFilterInfo[] | undefined;
  taskManager?: TaskManager | undefined;
  bypassAgentIds?: string[] | undefined;
  config?: Record<string, unknown>;
  graphLoader?: GraphDataLoader;
};

export type CacheTypes = "pureAgent" | "impureAgent";


export type AgentFunctionContext<ParamsType = DefaultParamsType, NamedInputDataType = DefaultInputData> = {
  params: NodeDataParams<ParamsType>;
  inputSchema?: any;
  namedInputs: NamedInputDataType;
  debugInfo: {
    verbose: boolean;
    nodeId: string;
    retry: number;
    agentId?: string;
    version?: number;
    isResult?: boolean;
  };
  graphData?: GraphData; // for nested graph. TODO remove next version.
  agents?: AgentFunctionInfoDictionary; // for nested graph. TODO remove next version.
  taskManager?: TaskManager; // for nested graph. TODO remove next version.
  forNestedGraph?: {
    graphData: GraphData; // nested graph
    agents: AgentFunctionInfoDictionary; // for nested graph
    graphOptions: GraphOptions;
    onLogCallback?: (log: TransactionLog, isUpdate: boolean) => void;
  };
  cacheType?: CacheTypes;
  onLogCallback?: (log: TransactionLog, isUpdate: boolean) => void; // TODO remove next version.
  filterParams: AgentFilterParams; // agent filter
  agentFilters?: AgentFilterInfo[];
  log?: TransactionLog[];
  config?: Record<string, unknown>;
};

export type AgentFunction<
  ParamsType = DefaultParamsType,
  ResultType = DefaultResultData,
  InputDataType = DefaultInputData,
  NamedInputDataType = undefined,
  > = NamedInputDataType extends undefined
  ? (context: AgentFunctionContext<ParamsType, InputDataType>) => Promise<ResultData<ResultType>>
  : (context: AgentFunctionContext<ParamsType, NamedInputDataType>) => Promise<ResultData<ResultType>>;

export type AgentFilterFunction<
  ParamsType = DefaultParamsType,
  ResultType = DefaultResultData,
  InputDataType = DefaultInputData,
  NamedInputDataType = undefined,
  > = NamedInputDataType extends undefined
  ? (context: AgentFunctionContext<ParamsType, InputDataType>, agent: AgentFunction) => Promise<ResultData<ResultType>>
  : (context: AgentFunctionContext<ParamsType, NamedInputDataType>, agent: AgentFunction) => Promise<ResultData<ResultType>>;

export type AgentFilterInfo = {
  name: string;
  agent: AgentFilterFunction;
  agentIds?: string[];
  nodeIds?: string[];
  filterParams?: AgentFilterParams;
};

export type AgentFunctionInfoSample = {
  inputs: any;
  params: DefaultParamsType;
  result: any;
  graph?: GraphData;
};

export type AgentFunctionInfo = {
  name: string;
  agent: AgentFunction<any, any, any, any>;
  mock: AgentFunction<any, any, any, any>;
  inputs?: any;
  output?: any;
  outputFormat?: any;
  params?: any;
  samples: AgentFunctionInfoSample[];
  description: string;
  category: string[];
  author: string;
  repository: string;
  license: string;
  cacheType?: CacheTypes;
  environmentVariables?: string[];
  stream?: boolean;
  apiKeys?: string[];
  npms?: string[];
};

export type AgentFunctionInfoDictionary = Record<string, AgentFunctionInfo>;

export type PropFunction = (result: ResultData, propId: string) => ResultData;
