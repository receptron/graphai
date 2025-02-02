import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GraphAILLMInputBase } from "@graphai/llm_utils";
type ReplicateInputs = {
    model?: string;
    verbose?: boolean;
    baseURL?: string;
    apiKey?: string;
    messages?: Array<Record<string, any>>;
    forWeb?: boolean;
} & GraphAILLMInputBase;
export declare const replicateAgent: AgentFunction<ReplicateInputs, Record<string, any> | string, ReplicateInputs>;
declare const replicateAgentInfo: AgentFunctionInfo;
export default replicateAgentInfo;
