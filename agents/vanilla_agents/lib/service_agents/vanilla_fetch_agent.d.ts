import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIDebug, GraphAIThrowError } from "@graphai/agent_utils";
type FetchParam = {
    url: string;
    method?: string;
    queryParams: any;
    headers: any;
    body: unknown;
};
export declare const vanillaFetchAgent: AgentFunction<Partial<FetchParam & GraphAIDebug & GraphAIThrowError & {
    type: string;
}>, unknown, FetchParam>;
declare const vanillaFetchAgentInfo: AgentFunctionInfo;
export default vanillaFetchAgentInfo;
