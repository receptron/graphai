import { AgentFunction } from "graphai";
export declare const anthropicAgent: AgentFunction<{
    model?: string;
    query?: string;
    system?: string;
    temperature?: number;
    max_tokens?: number;
}, Record<string, any> | string, string | Array<any>>;
declare const anthropicAgentInfo: {
    name: string;
    agent: AgentFunction<{
        model?: string | undefined;
        query?: string | undefined;
        system?: string | undefined;
        temperature?: number | undefined;
        max_tokens?: number | undefined;
    }, string | Record<string, any>, string | any[]>;
    mock: AgentFunction<{
        model?: string | undefined;
        query?: string | undefined;
        system?: string | undefined;
        temperature?: number | undefined;
        max_tokens?: number | undefined;
    }, string | Record<string, any>, string | any[]>;
    inputs: {
        type: string;
        properties: {
            prompt: {
                type: string;
                description: string;
            };
            messages: {
                type: string;
                description: string;
            };
        };
    };
    output: {
        type: string;
    };
    samples: never[];
    skipTest: boolean;
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
    npms: string[];
};
export default anthropicAgentInfo;
