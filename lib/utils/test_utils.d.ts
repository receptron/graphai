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
export declare const agentTestRunner: (agentInfo: AgentFunctionInfo) => Promise<void>;
export declare const agentFilterRunnerBuilder: (__agentFilters: AgentFilterInfo[]) => (context: AgentFunctionContext, agent: AgentFunction) => Promise<ResultData>;
