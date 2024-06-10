import { AgentFunction, AgentFunctionInfo } from "graphai";
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
declare const groqAgentInfo: AgentFunctionInfo;
export default groqAgentInfo;
