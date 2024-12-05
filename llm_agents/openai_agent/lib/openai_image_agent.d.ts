import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GraphAILLMInputBase } from "@graphai/llm_utils";
type OpenAIInputs = {
    model?: string;
    baseURL?: string;
    apiKey?: string;
    forWeb?: boolean;
} & GraphAILLMInputBase;
export declare const openAIImageAgent: AgentFunction<OpenAIInputs, Record<string, any> | string, OpenAIInputs>;
declare const openAIImageAgentInfo: AgentFunctionInfo;
export default openAIImageAgentInfo;
