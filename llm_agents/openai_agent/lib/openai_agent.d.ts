import OpenAI from "openai";
import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GraphAILLMInputBase, LLMMetaResponse } from "@graphai/llm_utils";
import type { GraphAINullableText, GraphAITool, GraphAIToolCalls } from "@graphai/agent_utils";
type OpenAIInputs = {
    model?: string;
    images?: string[];
    tools?: OpenAI.ChatCompletionTool[];
    tool_choice?: OpenAI.ChatCompletionToolChoiceOption;
    max_tokens?: number;
    verbose?: boolean;
    temperature?: number;
    messages?: Array<OpenAI.ChatCompletionMessageParam>;
    message?: OpenAI.ChatCompletionMessageParam;
    response_format?: OpenAI.ResponseFormatText | OpenAI.ResponseFormatJSONObject | OpenAI.ResponseFormatJSONSchema;
} & GraphAILLMInputBase;
type OpenAIConfig = {
    baseURL?: string;
    apiKey?: string;
    stream?: boolean;
    forWeb?: boolean;
    model?: string;
    dataStream?: boolean;
};
type OpenAIParams = OpenAIInputs & OpenAIConfig & {
    dataStream?: boolean;
};
type OpenAIResult = Partial<GraphAINullableText & GraphAITool & GraphAIToolCalls & {
    message: OpenAI.ChatCompletionMessageParam | null;
} & {
    messages: OpenAI.ChatCompletionMessageParam[];
} & LLMMetaResponse>;
export declare const openAIAgent: AgentFunction<OpenAIParams, OpenAIResult, OpenAIInputs, OpenAIConfig>;
export declare const openAIMockAgent: AgentFunction<OpenAIParams, OpenAIResult, OpenAIInputs, OpenAIConfig>;
declare const openaiAgentInfo: AgentFunctionInfo;
export default openaiAgentInfo;
