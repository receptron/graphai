import { AgentFunction, AgentFunctionInfo } from "../../index";
export declare const stringSplitterAgent: AgentFunction<{
    chunkSize?: number;
    overlap?: number;
}, {
    contents: Array<string>;
}, string>;
declare const stringSplitterAgentInfo: AgentFunctionInfo;
export default stringSplitterAgentInfo;
