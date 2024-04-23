import { AgentFunction } from "../graphai";
export declare const stringEmbeddingsAgent: AgentFunction<{
    model?: string;
}, {
    contents: any;
}, Array<string> | string>;
