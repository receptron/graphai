import { AgentFunction } from "graphai";
export declare const openAIAgent: AgentFunction<{
    model?: string;
    system?: string;
    tools?: any;
    tool_choice?: any;
    max_tokens?: number;
    verbose?: boolean;
    temperature?: number;
    baseURL?: string;
    apiKey?: string;
    stream?: boolean;
    prompt?: string;
    messages?: Array<Record<string, any>>;
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
        system?: string | undefined;
        tools?: any;
        tool_choice?: any;
        max_tokens?: number | undefined;
        verbose?: boolean | undefined;
        temperature?: number | undefined;
        baseURL?: string | undefined;
        apiKey?: string | undefined;
        stream?: boolean | undefined;
        prompt?: string | undefined;
        messages?: Record<string, any>[] | undefined;
    }, string | Record<string, any>, string | any[]>;
    mock: AgentFunction<{
        model?: string | undefined;
        query?: string | undefined;
        system?: string | undefined;
        verbose?: boolean | undefined;
        temperature?: number | undefined;
    }, string | Record<string, any>, string | any[]>;
    inputs: {
        type: string;
        properties: {
            model: {
                type: string;
            };
            system: {
                type: string;
            };
            tools: {
                type: string;
            };
            tool_choice: {
                type: string;
            };
            max_tokens: {
                type: string;
            };
            verbose: {
                type: string;
            };
            temperature: {
                type: string;
            };
            baseURL: {
                type: string;
            };
            apiKey: {
                type: string;
            };
            stream: {
                type: string;
            };
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
        properties: {
            id: {
                type: string;
            };
            object: {
                type: string;
            };
            created: {
                type: string;
            };
            model: {
                type: string;
            };
            choices: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        index: {
                            type: string;
                        };
                        message: {
                            type: string;
                            items: {
                                type: string;
                                properties: {
                                    content: {
                                        type: string;
                                    };
                                    role: {
                                        type: string;
                                    };
                                };
                                required: string[];
                            }[];
                        };
                    };
                    required: string[];
                }[];
            };
            usage: {
                type: string;
                properties: {
                    prompt_tokens: {
                        type: string;
                    };
                    completion_tokens: {
                        type: string;
                    };
                    total_tokens: {
                        type: string;
                    };
                };
                required: string[];
            };
        };
        required: string[];
    };
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
