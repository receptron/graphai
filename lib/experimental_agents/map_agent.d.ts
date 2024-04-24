import { GraphData, AgentFunction } from "../graphai";
export declare const mapAgent: AgentFunction<{
    graph: GraphData;
    resultFrom: string;
    injectionTo?: string;
}, {
    contents: Array<any>;
}, Array<any>>;
