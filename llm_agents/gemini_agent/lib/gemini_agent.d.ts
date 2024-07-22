import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GrapAILLMInputBase } from "@graphai/llm_utils";
type GeminiInputs = {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    tools?: Array<Record<string, any>>;
    messages?: Array<Record<string, any>>;
} & GrapAILLMInputBase;
export declare const geminiAgent: AgentFunction<GeminiInputs, Record<string, any> | string, string | Array<any>, GeminiInputs>;
declare const geminiAgentInfo: AgentFunctionInfo;
export default geminiAgentInfo;
