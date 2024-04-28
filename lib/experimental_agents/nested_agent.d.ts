import { AgentFunction } from "../graphai";
export declare const nestedAgent: AgentFunction<{
    injectionTo?: Array<string>;
}>;
declare const nestedAgentInfo: {
    name: string;
    agent: AgentFunction<{
        injectionTo?: string[] | undefined;
    }>;
    mock: AgentFunction<{
        injectionTo?: string[] | undefined;
    }>;
    samples: never[];
    description: string;
    author: string;
    repository: string;
    license: string;
};
export default nestedAgentInfo;
