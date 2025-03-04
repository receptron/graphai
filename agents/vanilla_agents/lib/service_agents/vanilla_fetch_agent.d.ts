import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIDebug, GraphAIThrowError } from "@graphai/agent_utils";
export declare const vanillaFetchAgent: AgentFunction<Partial<GraphAIDebug & GraphAIThrowError & {
    type: string;
}>, unknown, {
    url: string;
    method?: string;
    queryParams: any;
    headers: any;
    body: unknown;
}>;
declare const vanillaFetchAgentInfo: AgentFunctionInfo;
export default vanillaFetchAgentInfo;
