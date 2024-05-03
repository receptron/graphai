import { AgentFunction } from "../../graphai";
export declare const mapAgent: AgentFunction<{
    injectionTo?: Array<string>;
    limit?: number;
}, Record<string, Array<any>>, any>;
declare const mapAgentInfo: {
    name: string;
    agent: AgentFunction<{
        injectionTo?: string[] | undefined;
        limit?: number | undefined;
    }, Record<string, any[]>, any>;
    mock: AgentFunction<{
        injectionTo?: string[] | undefined;
        limit?: number | undefined;
    }, Record<string, any[]>, any>;
    samples: never[];
    description: string;
    category: never[];
    author: string;
    repository: string;
    license: string;
};
export default mapAgentInfo;
