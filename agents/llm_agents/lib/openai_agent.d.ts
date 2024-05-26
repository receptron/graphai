import { AgentFunction } from "graphai";
export declare const openAIAgent: AgentFunction<{
    model?: string;
    query?: string;
    system?: string;
    tools?: any;
    tool_choice?: any;
    verbose?: boolean;
    temperature?: number;
    baseURL?: string;
    apiKey?: string;
    stream?: boolean;
}, Record<string, any> | string, string | Array<any>>;
export declare const openAIMockAgent: AgentFunction<{
    model?: string;
    query?: string;
    system?: string;
    verbose?: boolean;
    temperature?: number;
}, Record<string, any> | string, string | Array<any>>;
declare const openaiAgentInfo: {
    name: string;
    agent: AgentFunction<{
        model?: string | undefined;
        query?: string | undefined;
        system?: string | undefined;
        tools?: any;
        tool_choice?: any;
        verbose?: boolean | undefined;
        temperature?: number | undefined;
        baseURL?: string | undefined;
        apiKey?: string | undefined;
        stream?: boolean | undefined;
    }, string | Record<string, any>, string | any[]>;
    mock: AgentFunction<{
        model?: string | undefined;
        query?: string | undefined;
        system?: string | undefined;
        verbose?: boolean | undefined;
        temperature?: number | undefined;
    }, string | Record<string, any>, string | any[]>;
    samples: {
        inputs: string[];
        params: {};
        result: {
            object: string;
            id: string;
            choices: {
                message: {
                    role: string;
                    content: string;
                };
                finish_reason: string;
                index: number;
                logprobs: null;
            }[];
            created: number;
            model: string;
        };
    }[];
    skipTest: boolean;
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
    stream: boolean;
    npms: string[];
};
export default openaiAgentInfo;
