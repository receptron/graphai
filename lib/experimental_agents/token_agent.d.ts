import { AgentFunction } from "../graphai";
export declare const tokenBoundStringsAgent: AgentFunction<{
    limit?: number;
}, {
    content: string;
}, Array<string>>;
