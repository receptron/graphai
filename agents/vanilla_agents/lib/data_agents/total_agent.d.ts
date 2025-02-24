import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const totalAgent: AgentFunction<{
    flatResponse?: boolean;
}, Record<string, number> | {
    data: Record<string, number>;
}, {
    array: Record<string, number>[];
}>;
declare const totalAgentInfo: AgentFunctionInfo;
export default totalAgentInfo;
