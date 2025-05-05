import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAISupressError } from "@graphai/agent_utils";
export declare const mapAgent: AgentFunction<Partial<GraphAISupressError & {
    limit: number;
    resultAll: boolean;
    compositeResult: boolean;
    rowKey: string;
}>, Record<string, any>>;
declare const mapAgentInfo: AgentFunctionInfo;
export default mapAgentInfo;
