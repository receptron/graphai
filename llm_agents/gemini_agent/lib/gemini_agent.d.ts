import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GraphAILLMInputBase, GraphAILlmMessage } from "@graphai/llm_utils";
import type { GraphAITool, GraphAIToolCalls, GraphAIMessage } from "@graphai/agent_utils";
type GeminiInputs = {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    tools?: Array<Record<string, any>>;
    response_format?: any;
    messages?: Array<GraphAILlmMessage>;
} & GraphAILLMInputBase;
type GeminiConfig = {
    apiKey?: string;
    stream?: boolean;
    dataStream?: boolean;
};
type GeminiParams = GeminiInputs & GeminiConfig;
type GeminiResult = Partial<GraphAITool & GraphAIToolCalls & GraphAIMessage & {
    messages: GraphAILlmMessage[];
}> | [];
export declare const geminiAgent: AgentFunction<GeminiParams, GeminiResult, GeminiInputs, GeminiConfig>;
declare const geminiAgentInfo: AgentFunctionInfo;
export default geminiAgentInfo;
