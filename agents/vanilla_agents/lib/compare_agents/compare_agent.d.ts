import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIResult, GraphAIArray } from "@graphai/agent_utils";
type CompareDataItem = string | number | boolean | CompareData;
type CompareData = CompareDataItem[];
export declare const compareAgent: AgentFunction<{
    operator: string;
    value: Record<string, unknown>;
}, GraphAIResult, Partial<GraphAIArray<CompareDataItem>> & {
    leftValue: CompareDataItem;
    rightValue: CompareDataItem;
}>;
declare const compareAgentInfo: AgentFunctionInfo;
export default compareAgentInfo;
