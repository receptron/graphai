import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIThrowError } from "@graphai/agent_utils";
export declare const mapAgent: AgentFunction<Partial<GraphAIThrowError & {
    limit: number;
    resultAll: boolean;
    compositeResult: boolean;
}>, Record<string, any>>;
declare const mapAgentInfo: AgentFunctionInfo;
export default mapAgentInfo;
