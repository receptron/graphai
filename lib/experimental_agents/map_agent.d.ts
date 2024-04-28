import { AgentFunction } from "../graphai";
export declare const mapAgent: AgentFunction<{
    injectionTo?: string;
}, Record<string, Array<any>>, any>;
declare const mapAgentInfo: {
    name: string;
    agent: AgentFunction<{
        injectionTo?: string | undefined;
    }, Record<string, any[]>, any>;
    mock: AgentFunction<{
        injectionTo?: string | undefined;
    }, Record<string, any[]>, any>;
    samples: never[];
    description: string;
    author: string;
    repository: string;
    license: string;
};
export default mapAgentInfo;
