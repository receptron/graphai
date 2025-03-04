import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIArray, GraphAIText } from "@graphai/agent_utils";
export declare const arrayJoinAgent: AgentFunction<{
    separator?: string;
    flat?: number;
}, GraphAIText, GraphAIArray>;
declare const arrayJoinAgentInfo: AgentFunctionInfo;
export default arrayJoinAgentInfo;
