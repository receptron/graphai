import { AgentFunction } from "../graphai";
export declare const dotProductAgent: AgentFunction<{
    inputKey?: string;
}, {
    contents: Array<number>;
}>;
export declare const sortByValuesAgent: AgentFunction<{
    inputKey?: string;
    assendant?: boolean;
}, {
    contents: Array<any>;
}>;
