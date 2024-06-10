import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const stringEmbeddingsAgent: AgentFunction<{
    model?: string;
}, any, Array<string> | string>;
declare const stringEmbeddingsAgentInfo: AgentFunctionInfo;
export default stringEmbeddingsAgentInfo;
