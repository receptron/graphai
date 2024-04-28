import { AgentFunction } from "../../graphai";
export declare const sleeperAgent: AgentFunction<{
    duration?: number;
    value?: Record<string, any>;
}>;
declare const sleeperAgentInfo: {
    name: string;
    agent: AgentFunction<{
        duration?: number | undefined;
        value?: Record<string, any> | undefined;
    }>;
    mock: AgentFunction<{
        duration?: number | undefined;
        value?: Record<string, any> | undefined;
    }>;
    samples: never[];
    description: string;
    author: string;
    repository: string;
    license: string;
};
export default sleeperAgentInfo;
