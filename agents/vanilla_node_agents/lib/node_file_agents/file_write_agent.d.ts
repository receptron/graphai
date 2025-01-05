import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const fileWriteAgent: AgentFunction<{
    baseDir?: string;
}, {
    result: boolean;
}, {
    text?: string;
    buffer?: Buffer;
    file: string;
}>;
declare const fileWriteAgentInfo: AgentFunctionInfo;
export default fileWriteAgentInfo;
