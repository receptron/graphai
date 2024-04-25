import { AgentFunction } from "../graphai";
export declare const mapAgent: AgentFunction<{
    resultFrom: string;
    injectionTo?: string;
}, {
    contents: Array<any>;
}, Array<any>>;
