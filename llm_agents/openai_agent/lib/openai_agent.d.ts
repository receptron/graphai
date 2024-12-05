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
    baseURL?: string;
    apiKey?: string;
    stream?: boolean;
    messages?: Array<OpenAI.ChatCompletionMessageParam>;
    forWeb?: boolean;
    response_format?: any;
} & GraphAILLMInputBase;
export declare const openAIAgent: AgentFunction<OpenAIInputs, Record<string, any> | string, OpenAIInputs>;
export declare const openAIMockAgent: AgentFunction<{
    model?: string;
    query?: string;
    system?: string;
    verbose?: boolean;
    temperature?: number;
}, Record<string, any> | string, string | Array<any>>;
declare const openaiAgentInfo: AgentFunctionInfo;
export default openaiAgentInfo;
