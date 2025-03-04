import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIText, GraphAIMessage, GraphAIMessageRole } from "@graphai/agent_utils";
export declare const textInputAgent: AgentFunction<{
    message?: string;
    required?: boolean;
    role?: GraphAIMessageRole;
}, Partial<GraphAIText & GraphAIMessage>>;
declare const textInputAgentInfo: AgentFunctionInfo;
export default textInputAgentInfo;
