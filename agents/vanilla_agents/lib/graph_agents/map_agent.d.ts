import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const mapAgent: AgentFunction<{
    namedInputs?: Array<string>;
    limit?: number;
}, Record<string, any>, any>;
declare const mapAgentInfo: AgentFunctionInfo;
export default mapAgentInfo;
