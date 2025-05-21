import { AgentFunction, AgentFunctionInfo } from "graphai";
type EmbeddingAIParams = {
    baseURL?: string;
    apiKey?: string;
    model?: string;
};
export declare const stringEmbeddingsAgent: AgentFunction<EmbeddingAIParams, number[][], {
    array: Array<string>;
    item: string;
}, EmbeddingAIParams>;
declare const stringEmbeddingsAgentInfo: AgentFunctionInfo;
export default stringEmbeddingsAgentInfo;
