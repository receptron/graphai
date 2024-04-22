import { AgentFunction } from "../graphai";
export declare const stringTemplateAgent: AgentFunction<{
    template: string;
    inputKey?: string;
}, {
    content: string;
}>;
export declare const stringSplitterAgent: AgentFunction<{
    chunkSize?: number;
    overlap?: number;
    inputKey?: string;
}, {
    contents: Array<string>;
}>;
