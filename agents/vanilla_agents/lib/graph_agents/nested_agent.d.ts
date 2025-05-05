import type { AgentFunction, AgentFunctionInfo, AgentFunctionContext, GraphData, ResultData, DefaultResultData } from "graphai";
import type { GraphAISupressError, GraphAIOnError } from "@graphai/agent_utils";
type NestedAgentGeneratorOption = {
    resultNodeId: string;
};
export declare const nestedAgentGenerator: (graphData: GraphData, options?: NestedAgentGeneratorOption) => (context: AgentFunctionContext) => Promise<ResultData<DefaultResultData> | GraphAIOnError>;
export declare const nestedAgent: AgentFunction<Partial<GraphAISupressError> & NestedAgentGeneratorOption>;
declare const nestedAgentInfo: AgentFunctionInfo;
export default nestedAgentInfo;
