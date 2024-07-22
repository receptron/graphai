import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GrapAILLMInputBase } from "@graphai/llm_utils";
type AnthropicInputs = {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
    messages?: Array<Record<string, any>>;
} & GrapAILLMInputBase;
export declare const anthropicAgent: AgentFunction<AnthropicInputs, Record<string, any> | string, string | Array<any>, AnthropicInputs>;
declare const anthropicAgentInfo: AgentFunctionInfo;
export default anthropicAgentInfo;
