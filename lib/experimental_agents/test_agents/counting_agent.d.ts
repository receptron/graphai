import { AgentFunction } from "../../graphai";
import { AgentFunctionInfo } from "../../type";
export declare const countingAgent: AgentFunction<{
    count: number;
}, {
    list: number[];
}>;
declare const countingAgentInfo: AgentFunctionInfo;
export default countingAgentInfo;
