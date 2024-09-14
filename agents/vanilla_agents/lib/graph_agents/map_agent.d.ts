import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const mapAgent: AgentFunction<{
    limit?: number;
    resultAll?: boolean;
}, Record<string, any>, any>;
declare const mapAgentInfo: AgentFunctionInfo;
export default mapAgentInfo;
