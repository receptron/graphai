export enum NodeState {
  Waiting = "waiting",
  Executing = "executing",
  Failed = "failed",
  TimedOut = "timed-out",
  Completed = "completed",
  Injected = "injected",
  Dispatched = "dispatched",
}
export type ResultData<ResultType = Record<string, any>> = ResultType | undefined;
export type ResultDataDictonary<ResultType = Record<string, any>> = Record<string, ResultData<ResultType>>;

export type NodeDataParams<ParamsType = Record<string, any>> = ParamsType; // Agent-specific parameters

export type DataSource = {
  nodeId: string;
  propId?: string;
};

export type NodeData = {
  inputs?: Array<string>;
  anyInput?: boolean; // any input makes this node ready
  params?: NodeDataParams;
  retry?: number;
  timeout?: number; // msec
  agentId?: string;
  fork?: number;
  source?: boolean;
  value?: ResultData; // initial value for static node.
  update?: string; // nodeId (+.propId) to get value after a loop
  outputs?: Record<string, string>; // mapping from routeId to nodeId
};

export type LoopData = {
  count?: number;
  while?: string;
};

export type GraphData = {
  agentId?: string;
  nodes: Record<string, NodeData>;
  concurrency?: number;
  loop?: LoopData;
  verbose?: boolean;
};

export type TransactionLog = {
  nodeId: string;
  state: NodeState;
  startTime: number;
  endTime?: number;
  retryCount?: number;
  agentId?: string;
  params?: NodeDataParams;
  inputs?: Array<ResultData>;
  errorMessage?: string;
  result?: ResultData;
  log?: TransactionLog[];
};

export type AgentFunctionContext<ParamsType, PreviousResultType> = {
  nodeId: string;
  forkIndex?: number;
  retry: number;
  params: NodeDataParams<ParamsType>;
  inputs: Array<PreviousResultType>;
  verbose: boolean;
  agents: CallbackDictonaryArgs;
  log: TransactionLog[];
};

export type AgentFunction<ParamsType = Record<string, any>, ResultType = Record<string, any>, PreviousResultType = Record<string, any>> = (
  context: AgentFunctionContext<ParamsType, PreviousResultType>,
) => Promise<ResultData<ResultType>>;

export type AgentFunctionDictonary = Record<string, AgentFunction<any, any, any>>;

export type CallbackDictonaryArgs = AgentFunctionDictonary;
