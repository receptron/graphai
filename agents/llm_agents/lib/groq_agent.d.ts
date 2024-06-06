import { AgentFunction } from "graphai";
import { Groq } from "groq-sdk";
export declare const groqAgent: AgentFunction<{
    model: string;
    system?: string;
    verbose?: boolean;
    tools?: Groq.Chat.CompletionCreateParams.Tool[];
    temperature?: number;
    max_tokens?: number;
    tool_choice?: Groq.Chat.CompletionCreateParams.ToolChoice;
    stream?: boolean;
    prompt?: string;
    messages?: Array<Record<string, any>>;
}, any, string | Array<Groq.Chat.CompletionCreateParams.Message>>;
declare const groqAgentInfo: {
    name: string;
    agent: AgentFunction<{
        model: string;
        system?: string | undefined;
        verbose?: boolean | undefined;
        tools?: Groq.Chat.Completions.CompletionCreateParams.Tool[] | undefined;
        temperature?: number | undefined;
        max_tokens?: number | undefined;
        tool_choice?: Groq.Chat.Completions.CompletionCreateParams.ToolChoice | undefined;
        stream?: boolean | undefined;
        prompt?: string | undefined;
        messages?: Record<string, any>[] | undefined;
    }, any, string | Groq.Chat.Completions.CompletionCreateParams.Message[]>;
    mock: AgentFunction<{
        model: string;
        system?: string | undefined;
        verbose?: boolean | undefined;
        tools?: Groq.Chat.Completions.CompletionCreateParams.Tool[] | undefined;
        temperature?: number | undefined;
        max_tokens?: number | undefined;
        tool_choice?: Groq.Chat.Completions.CompletionCreateParams.ToolChoice | undefined;
        stream?: boolean | undefined;
        prompt?: string | undefined;
        messages?: Record<string, any>[] | undefined;
    }, any, string | Groq.Chat.Completions.CompletionCreateParams.Message[]>;
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
