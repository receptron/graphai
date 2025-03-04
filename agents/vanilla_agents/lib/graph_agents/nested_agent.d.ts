import type { AgentFunction, AgentFunctionInfo, AgentFunctionContext, GraphData, ResultData, DefaultResultData } from "graphai";
import type { GraphAIThrowError, GraphAIOnError } from "@graphai/agent_utils";
type NestedAgentGeneratorOption = {
    resultNodeId: string;
};
export declare const nestedAgentGenerator: (graphData: GraphData, options?: NestedAgentGeneratorOption) => (context: AgentFunctionContext) => Promise<ResultData<DefaultResultData> | GraphAIOnError>;
export declare const nestedAgent: AgentFunction<Partial<GraphAIThrowError>>;
declare const nestedAgentInfo: AgentFunctionInfo;
export default nestedAgentInfo;
