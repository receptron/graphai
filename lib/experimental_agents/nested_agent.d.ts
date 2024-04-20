import { GraphData, AgentFunction } from "@/graphai";
export declare const nestedAgent: AgentFunction<{
    graph: GraphData;
    nodeId: string;
    inputNodes?: Array<string>;
}>;
