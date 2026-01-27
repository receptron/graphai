import OpenAI from "openai";
import { type AgentFunction, type AgentFunctionInfo } from "graphai";
import { GraphAILLMInputBase, LLMMetaResponse } from "@graphai/llm_utils";
import type { GraphAINullableText, GraphAITool, GraphAIToolCalls } from "@graphai/agent_utils";
type OpenAIInputs = {
    model?: string;
    images?: string[];
    tools?: OpenAI.ChatCompletionTool[];
    tool_choice?: OpenAI.ChatCompletionToolChoiceOption;
    max_tokens?: number;
    max_completion_tokens?: number;
    verbose?: boolean;
    temperature?: number;
    messages?: Array<OpenAI.ChatCompletionMessageParam>;
    message?: OpenAI.ChatCompletionMessageParam;
    response_format?: OpenAI.ResponseFormatText | OpenAI.ResponseFormatJSONObject | OpenAI.ResponseFormatJSONSchema;
} & GraphAILLMInputBase;
type OpenAIConfig = {
    baseURL?: string;
    apiKey?: string;
    apiVersion?: string;
    stream?: boolean;
    forWeb?: boolean;
    model?: string;
    dataStream?: boolean;
};
type OpenAIParams = OpenAIInputs & OpenAIConfig & {
    dataStream?: boolean;
};
type OpenAIResult = Partial<GraphAINullableText & GraphAITool & {
    responseFormat: any;
} & GraphAIToolCalls & {
    message: OpenAI.ChatCompletionMessageParam | null;
} & {
    messages: OpenAI.ChatCompletionMessageParam[];
} & LLMMetaResponse>;
export declare const openAIAgent: AgentFunction<OpenAIParams, OpenAIResult, OpenAIInputs, OpenAIConfig>;
export declare const openAIMockAgent: AgentFunction<OpenAIParams, OpenAIResult, OpenAIInputs, OpenAIConfig>;
declare const openaiAgentInfo: AgentFunctionInfo;
export default openaiAgentInfo;
