import { AgentFunction, AgentFunctionInfo } from "graphai";
import { ChatCompletionTool, ChatCompletionMessageParam, ChatCompletionToolChoiceOption } from "groq-sdk/resources/chat/completions";
import { GraphAILLMInputBase } from "@graphai/llm_utils";
import type { GraphAITool, GraphAIToolCalls, GraphAIMessage, GraphAIMessages } from "@graphai/agent_utils";
type GroqInputs = {
    verbose?: boolean;
    tools?: ChatCompletionTool[];
    temperature?: number;
    max_tokens?: number;
    tool_choice?: ChatCompletionToolChoiceOption;
    messages?: Array<ChatCompletionMessageParam>;
} & GraphAILLMInputBase;
type GroqConfig = {
    apiKey?: string;
    stream?: boolean;
    forWeb?: boolean;
};
type GroqParams = GroqInputs & GroqConfig & {
    model: string;
};
type GroqResult = Partial<GraphAITool & GraphAIToolCalls & GraphAIMessage & GraphAIMessages>;
export declare const groqAgent: AgentFunction<GroqParams, GroqResult, GroqInputs, GroqConfig>;
declare const groqAgentInfo: AgentFunctionInfo;
export default groqAgentInfo;
