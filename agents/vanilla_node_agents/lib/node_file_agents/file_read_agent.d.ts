import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const fileReadAgent: AgentFunction<{
    baseDir: string;
    outputType?: string;
}, {
    array?: string[] | unknown[];
    data?: string | unknown;
}, {
    array?: string[];
    file?: string;
}>;
declare const fileReadAgentInfo: AgentFunctionInfo;
export default fileReadAgentInfo;
