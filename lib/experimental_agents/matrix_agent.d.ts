import { AgentFunction } from "../graphai";
export declare const dotProductAgent: AgentFunction<Record<string, any>, {
    contents: Array<number>;
}, Array<Array<number>>>;
export declare const sortByValuesAgent: AgentFunction<{
    assendant?: boolean;
}, {
    contents: Array<any>;
}, Array<any>>;
