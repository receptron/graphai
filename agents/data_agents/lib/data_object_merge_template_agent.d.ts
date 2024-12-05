import { AgentFunction, AgentFunctionInfo } from "graphai";
type MegeDataType = Record<string, unknown>;
export declare const dataObjectMergeTemplateAgent: AgentFunction<null, MegeDataType, {
    array: MegeDataType[];
}>;
declare const dataObjectMergeTemplateAgentInfo: AgentFunctionInfo;
export default dataObjectMergeTemplateAgentInfo;
