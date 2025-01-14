import type { AgentFunction, AgentFunctionInfo, AgentFunctionContext, GraphData } from "graphai";
export declare const nestedAgentGenerator: (graphData: GraphData) => (context: AgentFunctionContext) => Promise<any>;
export declare const nestedAgent: AgentFunction<{
    throwError?: boolean;
}>;
declare const nestedAgentInfo: AgentFunctionInfo;
export default nestedAgentInfo;
