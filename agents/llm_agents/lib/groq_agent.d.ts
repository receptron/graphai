import { AgentFunction } from "graphai";
import { Groq } from "groq-sdk";
export declare const groqAgent: AgentFunction<{
    model: string;
    query?: string;
    system?: string;
    verbose?: boolean;
    tools?: Groq.Chat.CompletionCreateParams.Tool[];
    temperature?: number;
    max_tokens?: number;
    tool_choice?: Groq.Chat.CompletionCreateParams.ToolChoice;
    stream?: boolean;
}, any, string | Array<Groq.Chat.CompletionCreateParams.Message>>;
declare const groqAgentInfo: {
    name: string;
    agent: AgentFunction<{
        model: string;
        query?: string | undefined;
        system?: string | undefined;
        verbose?: boolean | undefined;
        tools?: Groq.Chat.Completions.CompletionCreateParams.Tool[] | undefined;
        temperature?: number | undefined;
        max_tokens?: number | undefined;
        tool_choice?: Groq.Chat.Completions.CompletionCreateParams.ToolChoice | undefined;
        stream?: boolean | undefined;
    }, any, string | Groq.Chat.Completions.CompletionCreateParams.Message[]>;
    mock: AgentFunction<{
        model: string;
        query?: string | undefined;
        system?: string | undefined;
        verbose?: boolean | undefined;
        tools?: Groq.Chat.Completions.CompletionCreateParams.Tool[] | undefined;
        temperature?: number | undefined;
        max_tokens?: number | undefined;
        tool_choice?: Groq.Chat.Completions.CompletionCreateParams.ToolChoice | undefined;
        stream?: boolean | undefined;
    }, any, string | Groq.Chat.Completions.CompletionCreateParams.Message[]>;
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
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
    stream: boolean;
    npms: string[];
};
export default groqAgentInfo;
