import Anthropic from "@anthropic-ai/sdk";
import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GraphAILLMInputBase } from "@graphai/llm_utils";
import type { GraphAITool, GraphAIToolCalls, GraphAIMessage, GraphAIMessages } from "@graphai/agent_utils";
type AnthropicInputs = {
    verbose?: boolean;
    model?: string;
    temperature?: number;
    max_tokens?: number;
    tools?: any[];
    tool_choice?: any;
    messages?: Array<Anthropic.MessageParam>;
} & GraphAILLMInputBase;
type AnthropicConfig = {
    apiKey?: string;
    stream?: boolean;
    forWeb?: boolean;
};
type AnthropicParams = AnthropicInputs & AnthropicConfig;
type AnthropicResult = Partial<GraphAITool & GraphAIToolCalls & GraphAIMessage<string | Anthropic.ContentBlockParam[]> & GraphAIMessages<string | Anthropic.ContentBlockParam[]>>;
export declare const anthropicAgent: AgentFunction<AnthropicParams, AnthropicResult, AnthropicInputs, AnthropicConfig>;
declare const anthropicAgentInfo: AgentFunctionInfo;
export default anthropicAgentInfo;
