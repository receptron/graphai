import { AgentFunctionInfo, AgentFunctionContext, AgentFunction, AgentFilterInfo, ResultData } from "../type";
export declare const defaultTestContext: {
    debugInfo: {
        nodeId: string;
        retry: number;
        verbose: boolean;
    };
    params: {};
    filterParams: {};
    agents: {};
    log: never[];
};
export declare const defaultAgentInfo: {
    name: string;
    samples: {
        inputs: never[];
        params: {};
        result: {};
    }[];
    description: string;
    category: never[];
    author: string;
    repository: string;
    license: string;
};
export declare const getAgentInfo: (agent: AgentFunction<any, any, any>) => {
    name: string;
    samples: {
        inputs: never[];
        params: {};
        result: {};
    }[];
    description: string;
    category: never[];
    author: string;
    repository: string;
    license: string;
    agent: AgentFunction<any, any, any>;
    mock: AgentFunction<any, any, any>;
};
export declare const agentTestRunner: (agentInfo: AgentFunctionInfo) => Promise<void>;
export declare const agentFilterRunnerBuilder: (__agentFilters: AgentFilterInfo[]) => (context: AgentFunctionContext, agent: AgentFunction) => Promise<ResultData>;
