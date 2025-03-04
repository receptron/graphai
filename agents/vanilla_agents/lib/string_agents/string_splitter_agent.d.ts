import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GraphAIText } from "@graphai/agent_utils";
export declare const stringSplitterAgent: AgentFunction<{
    chunkSize?: number;
    overlap?: number;
}, {
    contents: Array<string>;
    count: number;
    chunkSize: number;
    overlap: number;
}, GraphAIText>;
declare const stringSplitterAgentInfo: AgentFunctionInfo;
export default stringSplitterAgentInfo;
