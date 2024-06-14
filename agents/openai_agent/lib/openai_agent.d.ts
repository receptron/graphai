import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const openAIAgent: AgentFunction<{
    model?: string;
    system?: string;
    tools?: any;
    tool_choice?: any;
    max_tokens?: number;
    verbose?: boolean;
    temperature?: number;
    baseURL?: string;
    apiKey?: string;
    stream?: boolean;
    prompt?: string;
    messages?: Array<Record<string, any>>;
    forWeb?: boolean;
}, Record<string, any> | string, string | Array<any>>;
export declare const openAIMockAgent: AgentFunction<{
    model?: string;
    query?: string;
    system?: string;
    verbose?: boolean;
    temperature?: number;
}, Record<string, any> | string, string | Array<any>>;
declare const openaiAgentInfo: AgentFunctionInfo;
export default openaiAgentInfo;
