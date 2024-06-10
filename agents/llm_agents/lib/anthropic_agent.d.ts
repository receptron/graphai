import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const anthropicAgent: AgentFunction<{
    model?: string;
    system?: string;
    temperature?: number;
    max_tokens?: number;
    prompt?: string;
    messages?: Array<Record<string, any>>;
}, Record<string, any> | string, string | Array<any>>;
declare const anthropicAgentInfo: AgentFunctionInfo;
export default anthropicAgentInfo;
