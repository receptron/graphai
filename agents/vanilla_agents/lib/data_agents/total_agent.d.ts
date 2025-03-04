import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIArray } from "@graphai/agent_utils";
export declare const totalAgent: AgentFunction<{
    flatResponse?: boolean;
}, Record<string, number> | {
    data: Record<string, number>;
}, GraphAIArray<Record<string, number>>>;
declare const totalAgentInfo: AgentFunctionInfo;
export default totalAgentInfo;
