import { AgentFunction } from "../../graphai";
import { Groq } from "groq-sdk";
export declare const groqAgent: AgentFunction<{
    model: string;
    query?: string;
    system?: string;
    verbose?: boolean;
    tools?: Record<string, Groq.Chat.CompletionCreateParams.ToolChoice>;
    temperature?: number;
    max_tokens?: number;
    tool_choice?: string | Record<string, any>;
}, Record<string, any> | string, string | Array<Groq.Chat.CompletionCreateParams.Message>>;
declare const groqAgentInfo: {
    name: string;
    agent: AgentFunction<{
        model: string;
        query?: string | undefined;
        system?: string | undefined;
        verbose?: boolean | undefined;
        tools?: Record<string, Groq.Chat.Completions.CompletionCreateParams.ToolChoice> | undefined;
        temperature?: number | undefined;
        max_tokens?: number | undefined;
        tool_choice?: string | Record<string, any> | undefined;
    }, string | Record<string, any>, string | Groq.Chat.Completions.CompletionCreateParams.Message[]>;
    mock: AgentFunction<{
        model: string;
        query?: string | undefined;
        system?: string | undefined;
        verbose?: boolean | undefined;
        tools?: Record<string, Groq.Chat.Completions.CompletionCreateParams.ToolChoice> | undefined;
        temperature?: number | undefined;
        max_tokens?: number | undefined;
        tool_choice?: string | Record<string, any> | undefined;
    }, string | Record<string, any>, string | Groq.Chat.Completions.CompletionCreateParams.Message[]>;
    samples: never[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default groqAgentInfo;
