import { AgentFunction } from "../../graphai";
export declare const sleeperAgentDebug: AgentFunction<{
    duration: number;
    value?: Record<string, any>;
    fail?: boolean;
}>;
declare const sleeperAgentDebugInfo: {
    name: string;
    agent: AgentFunction<{
        duration: number;
        value?: Record<string, any> | undefined;
        fail?: boolean | undefined;
    }>;
    mock: AgentFunction<{
        duration: number;
        value?: Record<string, any> | undefined;
        fail?: boolean | undefined;
    }>;
    samples: never[];
    description: string;
    author: string;
    repository: string;
    license: string;
};
export default sleeperAgentDebugInfo;
