import { AgentFunctionInfo } from "../type";
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
