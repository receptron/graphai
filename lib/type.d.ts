import type { TransactionLog } from "./log";
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
export type DefaultResultData = Record<string, any>;
export type DefaultInputData = Record<string, any>;
export type ResultData<ResultType = DefaultResultData> = ResultType | undefined;
export type ResultDataDictonary<ResultType = DefaultResultData> = Record<string, ResultData<ResultType>>;
export type NodeDataParams<ParamsType = Record<string, any>> = ParamsType;
export type DataSource = {
    nodeId: string;
    propId?: string;
};
export type StaticNodeData = {
    value: ResultData;
    update?: string;
};
export type ComputedNodeData = {
    agentId: string;
    inputs?: Array<string>;
    anyInput?: boolean;
    params?: NodeDataParams;
    retry?: number;
    timeout?: number;
    fork?: number;
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
        forkIndex?: number;
        retry: number;
    };
    agents?: CallbackDictonaryArgs;
    log?: TransactionLog[];
};
export type AgentFunction<ParamsType = Record<string, any>, ResultType = DefaultResultData, InputDataType = DefaultInputData> = (context: AgentFunctionContext<ParamsType, InputDataType>) => Promise<ResultData<ResultType>>;
export type AgentFunctionDictonary = Record<string, AgentFunction<any, any, any>>;
export type CallbackDictonaryArgs = AgentFunctionDictonary;
