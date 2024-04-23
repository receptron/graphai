import { AgentFunction } from "../graphai";
export declare const getStringInput: (input: Record<string, string> | string, inputKey: string) => string;
export declare const stringTemplateAgent: AgentFunction<{
    template: string;
}, Record<string, any> | string, string>;
export declare const stringSplitterAgent: AgentFunction<{
    chunkSize?: number;
    overlap?: number;
}, {
    contents: Array<string>;
}, string>;
