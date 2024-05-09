import { AgentFunction } from "../../graphai";
import { Groq } from "groq-sdk";
export declare const groqAgent: AgentFunction<{
    model: string;
    query?: string;
    system?: string;
    verbose?: boolean;
    tools?: Record<string, Groq.Chat.CompletionCreateParams.Tool>;
    temperature?: number;
    max_tokens?: number;
    tool_choice?: string | Record<string, Groq.Chat.CompletionCreateParams.ToolChoice>;
}, Groq.Chat.ChatCompletion, string | Array<Groq.Chat.CompletionCreateParams.Message>>;
declare const groqAgentInfo: {
    name: string;
    agent: AgentFunction<{
        model: string;
        query?: string | undefined;
        system?: string | undefined;
        verbose?: boolean | undefined;
        tools?: Record<string, Groq.Chat.Completions.CompletionCreateParams.Tool> | undefined;
        temperature?: number | undefined;
        max_tokens?: number | undefined;
        tool_choice?: string | Record<string, Groq.Chat.Completions.CompletionCreateParams.ToolChoice> | undefined;
    }, Groq.Chat.Completions.ChatCompletion, string | Groq.Chat.Completions.CompletionCreateParams.Message[]>;
    mock: AgentFunction<{
        model: string;
        query?: string | undefined;
        system?: string | undefined;
        verbose?: boolean | undefined;
        tools?: Record<string, Groq.Chat.Completions.CompletionCreateParams.Tool> | undefined;
        temperature?: number | undefined;
        max_tokens?: number | undefined;
        tool_choice?: string | Record<string, Groq.Chat.Completions.CompletionCreateParams.ToolChoice> | undefined;
    }, Groq.Chat.Completions.ChatCompletion, string | Groq.Chat.Completions.CompletionCreateParams.Message[]>;
    samples: never[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default groqAgentInfo;
