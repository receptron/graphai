import type { AgentFunction, AgentFunctionInfo, DefaultResultData } from "graphai";
import type { GraphAIThrowError } from "@graphai/agent_utils";
export declare const lookupDictionaryAgent: AgentFunction<Record<string, DefaultResultData> & GraphAIThrowError, DefaultResultData, {
    namedKey: string;
}>;
declare const lookupDictionaryAgentInfo: AgentFunctionInfo;
export default lookupDictionaryAgentInfo;
