import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GraphAILLMInputBase } from "@graphai/llm_utils";
type AnthropicInputs = {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    messages?: Array<Record<string, any>>;
} & GraphAILLMInputBase;
type AnthropicConfig = {
    apiKey?: string;
    stream?: boolean;
    forWeb?: boolean;
};
type AnthropicParams = AnthropicInputs & AnthropicConfig;
type AnthropicResult = Record<string, any> | string;
export declare const anthropicAgent: AgentFunction<AnthropicParams, AnthropicResult, AnthropicInputs, AnthropicConfig>;
declare const anthropicAgentInfo: AgentFunctionInfo;
export default anthropicAgentInfo;
