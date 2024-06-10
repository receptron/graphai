import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const tokenBoundStringsAgent: AgentFunction<{
    limit?: number;
}, {
    content: string;
}, Array<string>>;
declare const tokenBoundStringsAgentInfo: AgentFunctionInfo;
export default tokenBoundStringsAgentInfo;
