import { AgentFunction } from "../graphai";
export declare const tokenBoundStringsAgent: AgentFunction<{
    inputKey?: string;
    limit?: number;
}, {
    content: string;
}>;
