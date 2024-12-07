import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const shellCommandAgent: AgentFunction<{
    command: string;
    cwd?: string;
    timeout?: number;
    env?: Record<string, string>;
}, {
    stdout: string;
    stderr: string;
}, Record<string, unknown>>;
declare const shellCommandAgentInfo: AgentFunctionInfo;
export default shellCommandAgentInfo;
