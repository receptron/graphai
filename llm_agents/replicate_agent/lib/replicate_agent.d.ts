import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GrapAILLMInputBase } from "@graphai/llm_utils";
type ReplicateInputs = {
    model?: string;
    verbose?: boolean;
    baseURL?: string;
    apiKey?: string;
    stream?: boolean;
    messages?: Array<Record<string, any>>;
    forWeb?: boolean;
} & GrapAILLMInputBase;
export declare const replicateAgent: AgentFunction<ReplicateInputs, Record<string, any> | string, ReplicateInputs>;
declare const replicateAgentInfo: AgentFunctionInfo;
export default replicateAgentInfo;
