import { AgentFunction, AgentFunctionInfo } from "graphai";
import fs from "fs";
export declare const fileReadAgent: AgentFunction<{
    baseDir: string;
    outputType?: string;
}, {
    array?: string[] | unknown[] | fs.ReadStream[];
    data?: string | unknown | fs.ReadStream;
}, {
    array?: string[];
    file?: string;
}>;
declare const fileReadAgentInfo: AgentFunctionInfo;
export default fileReadAgentInfo;
