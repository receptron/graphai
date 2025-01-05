import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const pathUtilsAgent: AgentFunction<{
    method: string;
    dirs?: string[];
    path?: string;
}, {
    path: string;
}, {
    dirs?: string[];
    path?: string;
}>;
declare const pathUtilsAgentInfo: AgentFunctionInfo;
export default pathUtilsAgentInfo;
