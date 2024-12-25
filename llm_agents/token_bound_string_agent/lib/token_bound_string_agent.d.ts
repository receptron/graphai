import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const tokenBoundStringsAgent: AgentFunction<{
    limit?: number;
}, {
    content: string;
    tokenCount: number;
    endIndex: number;
}, {
    chunks: Array<string>;
}>;
declare const tokenBoundStringsAgentInfo: AgentFunctionInfo;
export default tokenBoundStringsAgentInfo;
