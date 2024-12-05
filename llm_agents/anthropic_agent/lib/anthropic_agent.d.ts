import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GraphAILLMInputBase } from "@graphai/llm_utils";
type AnthropicInputs = {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
    messages?: Array<Record<string, any>>;
} & GraphAILLMInputBase;
export declare const anthropicAgent: AgentFunction<AnthropicInputs, Record<string, any> | string, AnthropicInputs>;
declare const anthropicAgentInfo: AgentFunctionInfo;
export default anthropicAgentInfo;
