import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const streamMockAgent: AgentFunction<{
    sleep?: number;
    message?: string;
}, {
    message: string;
}, {
    message: string;
}>;
declare const streamMockAgentInfo: AgentFunctionInfo;
export default streamMockAgentInfo;
