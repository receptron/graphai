import type { TransactionLog } from "./transaction_log";
import type { TaskManager } from "./task_manager";
export declare enum NodeState {
    Waiting = "waiting",
    Queued = "queued",
    Executing = "executing",
    ExecutingServer = "executing-server",
    Failed = "failed",
    TimedOut = "timed-out",
    Completed = "completed",
    Injected = "injected",
    Skipped = "skipped"
}
export type DefaultResultData = Record<string, any> | string | number | boolean | Array<DefaultResultData>;
export type DefaultInputData = Record<string, any>;
export type DefaultConfigData = Record<string, any>;
export type ResultData<ResultType = DefaultResultData> = ResultType | undefined;
export type ResultDataDictionary<ResultType = DefaultResultData> = Record<string, ResultData<ResultType>>;
export type ConfigData<ConfigType = DefaultConfigData> = ConfigType;
export type ConfigDataDictionary<ConfigType = DefaultConfigData> = Record<string, ConfigType>;
export type DefaultParamsType = Record<string, any>;
export type NodeDataParams<ParamsType = DefaultParamsType> = ParamsType;
export type PassThrough = Record<string, any>;
export type DataSource = {
    nodeId?: string;
    value?: any;
    propIds?: string[];
};
type ConsoleAttribute = boolean | string | Record<string, any>;
export type ConsoleElement = boolean | {
    before?: ConsoleAttribute;
    after?: ConsoleAttribute;
};
export type StaticNodeData = {
    value?: ResultData;
    update?: string;
    isResult?: boolean;
    console?: ConsoleElement;
};
export type AgentAnonymousFunction = (...params: any[]) => unknown;
export type AgentFilterParams = Record<string, any>;
export type GraphDataLoaderOption = {
    fileName: string;
    option?: any;
};
export type ComputedNodeData = {
    agent: string | AgentAnonymousFunction;
    inputs?: Record<string, any>;
    output?: Record<string, any>;
    anyInput?: boolean;
    params?: NodeDataParams;
    filterParams?: AgentFilterParams;
    retry?: number;
    timeout?: number;
    if?: string;
    unless?: string;
    defaultValue?: ResultData;
    graph?: GraphData | string;
    graphLoader?: GraphDataLoaderOption;
    isResult?: boolean;
    priority?: number;
    passThrough?: PassThrough;
    console?: ConsoleElement;
};
export type NodeData = StaticNodeData | ComputedNodeData;
export type LoopData = {
    count?: number;
    while?: string;
};
export type GraphData = {
    version?: number;
    nodes: Record<string, NodeData>;
    concurrency?: number;
    loop?: LoopData;
    verbose?: boolean;
    retry?: number;
    metadata?: any;
};
export type GraphDataLoader = (loaderOption: GraphDataLoaderOption) => GraphData;
export type GraphOptions = {
    agentFilters?: AgentFilterInfo[] | undefined;
    taskManager?: TaskManager | undefined;
    bypassAgentIds?: string[] | undefined;
    config?: ConfigDataDictionary;
    graphLoader?: GraphDataLoader;
};
export type CacheTypes = "pureAgent" | "impureAgent";
export type AgentFunctionContext<ParamsType = DefaultParamsType, NamedInputDataType = DefaultInputData, ConfigType = DefaultConfigData> = {
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
    forNestedGraph?: {
        graphData?: GraphData;
        agents: AgentFunctionInfoDictionary;
        graphOptions: GraphOptions;
        onLogCallback?: (log: TransactionLog, isUpdate: boolean) => void;
    };
    cacheType?: CacheTypes;
    filterParams: AgentFilterParams;
    agentFilters?: AgentFilterInfo[];
    log?: TransactionLog[];
    config?: ConfigType;
};
export type AgentFunction<ParamsType = DefaultParamsType, ResultType = DefaultResultData, NamedInputDataType = DefaultInputData, ConfigType = DefaultConfigData> = (context: AgentFunctionContext<ParamsType, NamedInputDataType, ConfigType>) => Promise<ResultData<ResultType>>;
export type AgentFilterFunction<ParamsType = DefaultParamsType, ResultType = DefaultResultData, NamedInputDataType = DefaultInputData> = (context: AgentFunctionContext<ParamsType, NamedInputDataType>, agent: AgentFunction) => Promise<ResultData<ResultType>>;
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
    config?: any;
    tools?: Record<string, any>[];
    samples: AgentFunctionInfoSample[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
    cacheType?: CacheTypes;
    environmentVariables?: string[];
    hasGraphData?: boolean;
    stream?: boolean;
    apiKeys?: string[];
    npms?: string[];
};
export type AgentFunctionInfoDictionary = Record<string, AgentFunctionInfo>;
export type PropFunction = (result: ResultData, propId: string) => ResultData;
export {};
