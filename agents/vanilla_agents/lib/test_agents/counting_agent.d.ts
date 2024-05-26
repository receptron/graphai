import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const countingAgent: AgentFunction<{
    count: number;
}, {
    list: number[];
}>;
declare const countingAgentInfo: AgentFunctionInfo;
export default countingAgentInfo;
