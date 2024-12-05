import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const stringEmbeddingsAgent: AgentFunction<{
    model?: string;
}, number[][], {
    array: Array<string>;
    item: string;
}>;
declare const stringEmbeddingsAgentInfo: AgentFunctionInfo;
export default stringEmbeddingsAgentInfo;
