import { AgentFunctionInfo } from "../type";
export declare const getAgentInfo: (agent: import("../type").AgentFunction<any, any, any>) => {
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
    agent: import("../type").AgentFunction<any, any, any>;
    mock: import("../type").AgentFunction<any, any, any>;
};
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
