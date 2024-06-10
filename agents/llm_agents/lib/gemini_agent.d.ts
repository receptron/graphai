import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const geminiAgent: AgentFunction<{
    model?: string;
    system?: string;
    temperature?: number;
    max_tokens?: number;
    tools?: Array<Record<string, any>>;
    prompt?: string;
    messages?: Array<Record<string, any>>;
}, Record<string, any> | string, string | Array<any>>;
declare const geminiAgentInfo: AgentFunctionInfo;
export default geminiAgentInfo;
