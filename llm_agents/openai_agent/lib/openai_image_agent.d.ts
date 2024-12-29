import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GraphAILLMInputBase } from "@graphai/llm_utils";
type OpenAIInputs = {
    model?: string;
} & GraphAILLMInputBase;
type OpenAIConfig = {
    baseURL?: string;
    apiKey?: string;
    forWeb?: boolean;
};
type OpenAIParams = OpenAIInputs & OpenAIConfig;
export declare const openAIImageAgent: AgentFunction<OpenAIParams, Record<string, any> | string, OpenAIInputs, OpenAIConfig>;
declare const openAIImageAgentInfo: AgentFunctionInfo;
export default openAIImageAgentInfo;
