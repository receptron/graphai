import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GraphAIData, GraphAIArray } from "@graphai/agent_utils";
type MergeDataType = Record<string, unknown>;
export declare const dataObjectMergeTemplateAgent: AgentFunction<{
    flatResponse?: boolean;
}, MergeDataType | GraphAIData<MergeDataType>, GraphAIArray<MergeDataType>>;
declare const dataObjectMergeTemplateAgentInfo: AgentFunctionInfo;
export default dataObjectMergeTemplateAgentInfo;
