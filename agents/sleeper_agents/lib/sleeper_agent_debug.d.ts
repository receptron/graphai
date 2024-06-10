import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const sleeperAgentDebug: AgentFunction<{
    duration: number;
    value?: Record<string, any>;
    fail?: boolean;
}>;
declare const sleeperAgentDebugInfo: AgentFunctionInfo;
export default sleeperAgentDebugInfo;
