import type { AgentFunction, AgentFunctionInfo, AgentFunctionContext, GraphData } from "graphai";
import type { GraphAIThrowError } from "@graphai/agent_utils";
type NestedAgentGeneratorOption = {
    resultNodeId: string;
};
export declare const nestedAgentGenerator: (graphData: GraphData, options?: NestedAgentGeneratorOption) => (context: AgentFunctionContext) => Promise<any>;
export declare const nestedAgent: AgentFunction<GraphAIThrowError>;
declare const nestedAgentInfo: AgentFunctionInfo;
export default nestedAgentInfo;
