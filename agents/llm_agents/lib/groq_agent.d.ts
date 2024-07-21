import { AgentFunction, AgentFunctionInfo } from "graphai";
import { Groq } from "groq-sdk";
import { AIAPIInputBase } from "./utils";
type GroqInputs = {
    model: string;
    verbose?: boolean;
    tools?: Groq.Chat.CompletionCreateParams.Tool[];
    temperature?: number;
    max_tokens?: number;
    tool_choice?: Groq.Chat.CompletionCreateParams.ToolChoice;
    stream?: boolean;
    messages?: Array<Record<string, any>>;
} & AIAPIInputBase;
export declare const groqAgent: AgentFunction<GroqInputs, any, string | Array<Groq.Chat.CompletionCreateParams.Message>, GroqInputs>;
declare const groqAgentInfo: AgentFunctionInfo;
export default groqAgentInfo;
