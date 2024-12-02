import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const fileReadAgent: AgentFunction<{
    basePath: string;
    outputType?: string;
}, {
    array: string[] | unknown[];
}, Array<never>, {
    array: string[];
}>;
declare const fileReadAgentInfo: AgentFunctionInfo;
export default fileReadAgentInfo;
