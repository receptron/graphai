import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIDebug, GraphAIThrowError } from "@graphai/agent_utils";
export declare const fetchAgent: AgentFunction<Partial<GraphAIThrowError & GraphAIDebug & {
    type?: string;
}>, unknown, {
    url: string;
    method?: string;
    queryParams: any;
    headers: any;
    body: unknown;
}>;
declare const fetchAgentInfo: AgentFunctionInfo;
export default fetchAgentInfo;
