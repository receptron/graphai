import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIArray, GraphAIResult } from "@graphai/agent_utils";
export declare const dataSumTemplateAgent: AgentFunction<{
    flatResponse?: boolean;
}, number | GraphAIResult<number>, GraphAIArray<number>>;
declare const dataSumTemplateAgentInfo: AgentFunctionInfo;
export default dataSumTemplateAgentInfo;
