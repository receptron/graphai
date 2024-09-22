import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const stringSplitterAgent: AgentFunction<{
    chunkSize?: number;
    overlap?: number;
}, {
    contents: Array<string>;
    count: number;
    chunkSize: number;
    overlap: number;
}, null, {
    text: string;
}>;
declare const stringSplitterAgentInfo: AgentFunctionInfo;
export default stringSplitterAgentInfo;
