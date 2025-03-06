import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIArray, GraphAIFlatResponse, GraphAIData } from "@graphai/agent_utils";
type ResponseData = Record<string, number>;
export declare const totalAgent: AgentFunction<Partial<GraphAIFlatResponse>, ResponseData | GraphAIData<ResponseData>, GraphAIArray<Record<string, number>>>;
declare const totalAgentInfo: AgentFunctionInfo;
export default totalAgentInfo;
