import { AgentFunction, AgentFunctionInfo } from "graphai";
import { AIAPIInputBase } from "./utils";
type AnthropicInputs = {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    messages?: Array<Record<string, any>>;
} & AIAPIInputBase;
export declare const anthropicAgent: AgentFunction<AnthropicInputs, Record<string, any> | string, string | Array<any>, AnthropicInputs>;
declare const anthropicAgentInfo: AgentFunctionInfo;
export default anthropicAgentInfo;
