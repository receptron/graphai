import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIDebug, GraphAIThrowError, GraphAIFlatResponse } from "@graphai/agent_utils";
type FetchParam = {
    url: string;
    method?: string;
    queryParams: any;
    headers: Record<string, any>;
    body: unknown;
};
export declare const vanillaFetchAgent: AgentFunction<Partial<FetchParam & GraphAIDebug & GraphAIThrowError & GraphAIFlatResponse & {
    type: string;
}>, unknown, FetchParam>;
declare const vanillaFetchAgentInfo: AgentFunctionInfo;
export default vanillaFetchAgentInfo;
