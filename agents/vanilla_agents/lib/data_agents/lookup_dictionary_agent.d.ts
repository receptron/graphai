import type { AgentFunction, AgentFunctionInfo, DefaultResultData } from "graphai";
import type { GraphAISupressError } from "@graphai/agent_utils";
export declare const lookupDictionaryAgent: AgentFunction<Record<string, DefaultResultData> & GraphAISupressError, DefaultResultData, {
    namedKey: string;
}>;
declare const lookupDictionaryAgentInfo: AgentFunctionInfo;
export default lookupDictionaryAgentInfo;
