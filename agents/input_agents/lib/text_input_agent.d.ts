import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const textInputAgent: AgentFunction<{
    message?: string;
    required: boolean;
}, string | {
    [x: string]: string;
}>;
declare const textInputAgentInfo: AgentFunctionInfo;
export default textInputAgentInfo;
