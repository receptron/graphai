import type { TransactionLog } from "./transaction_log";
import type { TaskManager } from "./task_manager";
export declare enum NodeState {
    Waiting = "waiting",
    Queued = "queued",
    Executing = "executing",
    Failed = "failed",
    TimedOut = "timed-out",
    Completed = "completed",
    Injected = "injected",
    Dispatched = "dispatched"
}
export type DefaultResultData = Record<string, any> | string | number | Array<DefaultResultData>;
export type DefaultInputData = Record<string, any>;
export type ResultData<ResultType = DefaultResultData> = ResultType | undefined;
export type ResultDataDictonary<ResultType = DefaultResultData> = Record<string, ResultData<ResultType>>;
export type DefaultParamsType = Record<string, any>;
export type NodeDataParams<ParamsType = DefaultParamsType> = ParamsType;
export type DataSource = {
    nodeId: string;
    propIds?: string[];
};
export type StaticNodeData = {
    value: ResultData;
    update?: string;
    isResult?: boolean;
};
export type ComputedNodeData = {
    agentId: string;
    inputs?: Array<string>;
    anyInput?: boolean;
    params?: NodeDataParams;
    retry?: number;
    timeout?: number;
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
export type AgentFunction<ParamsType = DefaultParamsType, ResultType = DefaultResultData, InputDataType = DefaultInputData> = (context: AgentFunctionContext<ParamsType, InputDataType>) => Promise<ResultData<ResultType>>;
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
    category: string[];
    author: string;
    repository: string;
    license: string;
};
