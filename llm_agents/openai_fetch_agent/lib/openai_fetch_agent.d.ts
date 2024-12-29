import OpenAI from "openai";
import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GraphAILLMInputBase } from "@graphai/llm_utils";
type OpenAIInputs = {
    model?: string;
    images?: string[];
    tools?: OpenAI.ChatCompletionTool[];
    tool_choice?: OpenAI.ChatCompletionToolChoiceOption;
    max_tokens?: number;
    verbose?: boolean;
    temperature?: number;
    messages?: Array<OpenAI.ChatCompletionMessageParam>;
    response_format?: any;
} & GraphAILLMInputBase;
type OpenAIConfig = {
    baseURL?: string;
    apiKey?: string;
    stream?: boolean;
};
type OpenAIParams = OpenAIInputs & OpenAIConfig;
export declare const openAIFetchAgent: AgentFunction<OpenAIParams, Record<string, any> | string, OpenAIInputs, OpenAIConfig>;
export declare const openAIMockAgent: AgentFunction<{
    model?: string;
    query?: string;
    system?: string;
    verbose?: boolean;
    temperature?: number;
}, Record<string, any> | string, string | Array<any>>;
declare const openAIFetchAgentInfo: AgentFunctionInfo;
export default openAIFetchAgentInfo;
