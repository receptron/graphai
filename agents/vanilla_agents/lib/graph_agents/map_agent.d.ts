import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const mapAgent: AgentFunction<{
    limit?: number;
    resultAll?: boolean;
    compositeResult?: boolean;
    throwError?: boolean;
}, Record<string, any>>;
declare const mapAgentInfo: AgentFunctionInfo;
export default mapAgentInfo;
