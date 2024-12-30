import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GraphAILLMInputBase, GraphAILlmMessage } from "@graphai/llm_utils";
type GeminiInputs = {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    tools?: Array<Record<string, any>>;
    messages?: Array<GraphAILlmMessage>;
} & GraphAILLMInputBase;
type GeminiConfig = {
    apiKey?: string;
    stream?: boolean;
};
type GeminiParams = GeminiInputs & GeminiConfig;
export declare const geminiAgent: AgentFunction<GeminiParams, Record<string, any> | string, GeminiInputs, GeminiConfig>;
declare const geminiAgentInfo: AgentFunctionInfo;
export default geminiAgentInfo;
