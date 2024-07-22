import { AgentFunction, AgentFunctionInfo } from "graphai";
import { Groq } from "groq-sdk";
import { GrapAILLMInputBase } from "@graphai/llm_utils";
type GroqInputs = {
    verbose?: boolean;
    tools?: Groq.Chat.CompletionCreateParams.Tool[];
    temperature?: number;
    max_tokens?: number;
    tool_choice?: Groq.Chat.CompletionCreateParams.ToolChoice;
    stream?: boolean;
    messages?: Array<Record<string, any>>;
} & GrapAILLMInputBase;
export declare const groqAgent: AgentFunction<GroqInputs & {
    model: string;
}, any, string | Array<Groq.Chat.CompletionCreateParams.Message>, GroqInputs>;
declare const groqAgentInfo: AgentFunctionInfo;
export default groqAgentInfo;
