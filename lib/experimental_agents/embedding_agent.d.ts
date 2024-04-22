import { AgentFunction } from "../graphai";
export declare const stringEmbeddingsAgent: AgentFunction<{
    inputKey?: string;
    model?: string;
}, {
    contents: any;
}>;
