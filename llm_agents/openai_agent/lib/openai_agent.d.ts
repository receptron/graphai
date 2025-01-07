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
    forWeb?: boolean;
    model?: string;
};
type OpenAIParams = OpenAIInputs & OpenAIConfig;
type OpenAIResult = Record<string, any> | string;
export declare const openAIAgent: AgentFunction<OpenAIParams, OpenAIResult, OpenAIInputs, OpenAIConfig>;
export declare const openAIMockAgent: AgentFunction<{
    model?: string;
    query?: string;
    system?: string;
    verbose?: boolean;
    temperature?: number;
}, Record<string, any> | string, string | Array<any>>;
declare const openaiAgentInfo: AgentFunctionInfo;
export default openaiAgentInfo;
