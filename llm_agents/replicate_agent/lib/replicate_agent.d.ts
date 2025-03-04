import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GraphAILLMInputBase } from "@graphai/llm_utils";
import type { GraphAIText, GraphAIMessage } from "@graphai/agent_utils";
type ReplicateInputs = {
    model?: string;
    verbose?: boolean;
    baseURL?: string;
    apiKey?: string;
    messages?: Array<Record<string, any>>;
    forWeb?: boolean;
} & GraphAILLMInputBase;
type ReplicateResult = GraphAIText & GraphAIMessage & {
    choices: Array<GraphAIMessage>;
};
export declare const replicateAgent: AgentFunction<ReplicateInputs, ReplicateResult, ReplicateInputs>;
declare const replicateAgentInfo: AgentFunctionInfo;
export default replicateAgentInfo;
