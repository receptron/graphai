import { AgentFunction, AgentFunctionInfo, GraphData } from "graphai";
export declare const getNestedGraphData: (graphData: GraphData | string | undefined, __inputs: Array<any>) => GraphData;
export declare const nestedAgent: AgentFunction<{
    namedInputs?: Array<string>;
}>;
declare const nestedAgentInfo: AgentFunctionInfo;
export default nestedAgentInfo;
