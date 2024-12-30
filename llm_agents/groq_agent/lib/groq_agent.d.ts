import { AgentFunction, AgentFunctionInfo } from "graphai";
import { ChatCompletionTool, ChatCompletionMessageParam, ChatCompletionToolChoiceOption } from "groq-sdk/resources/chat/completions";
import { GraphAILLMInputBase } from "@graphai/llm_utils";
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
export declare const groqAgent: AgentFunction<GroqParams, any, GroqInputs, GroqConfig>;
declare const groqAgentInfo: AgentFunctionInfo;
export default groqAgentInfo;
