import { AgentFunction } from "../../index";
import { Groq } from "groq-sdk";
export declare const groqStreamAgent: AgentFunction<{
    model: string;
    query?: string;
    system?: string;
    verbose?: boolean;
    tools?: Groq.Chat.CompletionCreateParams.Tool[];
    temperature?: number;
    max_tokens?: number;
    tool_choice?: Groq.Chat.CompletionCreateParams.ToolChoice;
}, any, string | Array<Groq.Chat.CompletionCreateParams.Message>>;
declare const groqStreamAgentInfo: {
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
    }, any, string | Groq.Chat.Completions.CompletionCreateParams.Message[]>;
    samples: never[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default groqStreamAgentInfo;
