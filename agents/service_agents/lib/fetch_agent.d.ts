import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIDebug, GraphAISupressError, GraphAIOnError } from "@graphai/agent_utils";
type GraphAIHttpDebug = {
    url?: string;
    method?: string;
    headers?: unknown;
    body?: unknown;
};
export declare const fetchAgent: AgentFunction<Partial<GraphAISupressError & GraphAIDebug & {
    type?: string;
}>, GraphAIOnError<string> | GraphAIHttpDebug | string, {
    url: string;
    method?: string;
    queryParams: any;
    headers: any;
    body: unknown;
}>;
declare const fetchAgentInfo: AgentFunctionInfo;
export default fetchAgentInfo;
