import { GraphData, AgentFunction } from "../graphai";
export declare const nestedAgent: AgentFunction<{
    graph: GraphData;
    resultFrom: string;
    injectionTo?: Array<string>;
}>;
