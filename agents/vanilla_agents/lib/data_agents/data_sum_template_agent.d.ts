import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIArray, GraphAIResult, GraphAIFlatResponse } from "@graphai/agent_utils";
export declare const dataSumTemplateAgent: AgentFunction<Partial<GraphAIFlatResponse>, number | GraphAIResult<number>, GraphAIArray<number>>;
declare const dataSumTemplateAgentInfo: AgentFunctionInfo;
export default dataSumTemplateAgentInfo;
