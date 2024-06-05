import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const stringSplitterAgent: AgentFunction<{
    chunkSize?: number;
    overlap?: number;
}, {
    contents: Array<string>;
}, string>;
declare const stringSplitterAgentInfo: AgentFunctionInfo;
export default stringSplitterAgentInfo;
