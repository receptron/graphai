import { AgentFunction, AgentFunctionInfo } from "graphai";
import { SchemaUnion } from "@google/genai";
import { GraphAILLMInputBase, GraphAILlmMessage } from "@graphai/llm_utils";
import type { GraphAITool, GraphAIToolCalls, GraphAIMessage } from "@graphai/agent_utils";
type GeminiResponseFormat = {
    type: string;
    json_schema: {
        schema: SchemaUnion;
        strict?: boolean;
    };
};
type GeminiInputs = {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    tools?: Array<Record<string, any>>;
    tool_choice?: string;
    response_format?: GeminiResponseFormat;
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
