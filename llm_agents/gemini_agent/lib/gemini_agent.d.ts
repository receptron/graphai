import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GraphAILLMInputBase, GraphAILlmMessage } from "@graphai/llm_utils";
type GeminiInputs = {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    tools?: Array<Record<string, any>>;
    messages?: Array<GraphAILlmMessage>;
} & GraphAILLMInputBase;
export declare const geminiAgent: AgentFunction<GeminiInputs, Record<string, any> | string, GeminiInputs>;
declare const geminiAgentInfo: AgentFunctionInfo;
export default geminiAgentInfo;
