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
  Dispatched = "dispatched",
}

export type DefaultResultData = Record<string, any>;
export type DefaultInputData = Record<string, any>;
export type ResultData<ResultType = DefaultResultData> = ResultType | undefined;
export type ResultDataDictonary<ResultType = DefaultResultData> = Record<string, ResultData<ResultType>>;

export type DefaultParamsType = Record<string, any>;
export type NodeDataParams<ParamsType = DefaultParamsType> = ParamsType; // Agent-specific parameters

export type DataSource = {
  nodeId: string;
  propId?: string;
};

export type StaticNodeData = {
  value: ResultData; // initial value for static node.
  update?: string; // nodeId (+.propId) to get value after a loop
  isResult?: boolean;
};
export type ComputedNodeData = {
  agentId: string;
  inputs?: Array<string>;
  anyInput?: boolean; // any input makes this node ready
  params?: NodeDataParams;
  retry?: number;
  timeout?: number; // msec
  graph?: GraphData;
  isResult?: boolean;
};

export type NodeData = StaticNodeData | ComputedNodeData;

export type LoopData = {
  count?: number;
  while?: string;
};

export type GraphData = {
  nodes: Record<string, NodeData>;
  concurrency?: number;
  loop?: LoopData;
  verbose?: boolean;
};

export type AgentFunctionContext<ParamsType, InputDataType> = {
  params: NodeDataParams<ParamsType>;
  inputs: Array<InputDataType>;
  debugInfo: {
    verbose: boolean;
    nodeId: string;
    retry: number;
  };
  graphData?: GraphData | string;
  agents?: AgentFunctionDictonary;
  log?: TransactionLog[];
  taskManager?: TaskManager;
};

export type AgentFunction<ParamsType = DefaultParamsType, ResultType = DefaultResultData, InputDataType = DefaultInputData> = (
  context: AgentFunctionContext<ParamsType, InputDataType>,
) => Promise<ResultData<ResultType>>;

export type AgentFunctionDictonary = Record<string, AgentFunction<any, any, any>>;

export type AgentFunctionInfo = {
  name: string;
  agent: AgentFunction<any, any, any>;
  mock: AgentFunction<any, any, any>;
  samples: {
    inputs: any;
    params: DefaultParamsType;
    result: any;
  }[];
  description: string;
  author: string;
  repository: string;
  license: string;
};
