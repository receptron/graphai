import type { AgentFunction, AgentFunctionInfo, AgentFunctionContext, GraphData } from "graphai";
type NestedAgentGeneratorOption = {
    resultNodeId: string;
};
export declare const nestedAgentGenerator: (graphData: GraphData, options?: NestedAgentGeneratorOption) => (context: AgentFunctionContext) => Promise<any>;
export declare const nestedAgent: AgentFunction<{
    throwError?: boolean;
}>;
declare const nestedAgentInfo: AgentFunctionInfo;
export default nestedAgentInfo;
