import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIDebug, GraphAISupressError, GraphAIFlatResponse } from "@graphai/agent_utils";
type FetchParam = {
    url: string;
    method?: string;
    queryParams: any;
    headers: Record<string, any>;
    body: unknown;
};
export declare const vanillaFetchAgent: AgentFunction<Partial<FetchParam & GraphAIDebug & GraphAISupressError & GraphAIFlatResponse & {
    type: string;
}>, unknown, FetchParam>;
declare const vanillaFetchAgentInfo: AgentFunctionInfo;
export default vanillaFetchAgentInfo;
