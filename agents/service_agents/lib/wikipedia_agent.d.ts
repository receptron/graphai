import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const wikipediaAgent: AgentFunction<{
    lang?: string;
    summary?: boolean;
}, Record<string, any> | undefined, string>;
declare const wikipediaAgentInfo: AgentFunctionInfo;
export default wikipediaAgentInfo;
