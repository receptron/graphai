import { AgentFunction, AgentFunctionInfo } from "graphai";
import { AIAPIInputBase } from "./utils";
type GeminiInputs = {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    tools?: Array<Record<string, any>>;
    messages?: Array<Record<string, any>>;
} & AIAPIInputBase;
export declare const geminiAgent: AgentFunction<GeminiInputs, Record<string, any> | string, string | Array<any>, GeminiInputs>;
declare const geminiAgentInfo: AgentFunctionInfo;
export default geminiAgentInfo;
