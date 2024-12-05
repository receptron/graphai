import { AgentFunction, AgentFunctionInfo } from "graphai";
import { ChatCompletionTool, ChatCompletionMessageParam, ChatCompletionToolChoiceOption } from "groq-sdk/resources/chat/completions";
import { GraphAILLMInputBase } from "@graphai/llm_utils";
type GroqInputs = {
    verbose?: boolean;
    tools?: ChatCompletionTool[];
    temperature?: number;
    max_tokens?: number;
    tool_choice?: ChatCompletionToolChoiceOption;
    stream?: boolean;
    messages?: Array<ChatCompletionMessageParam>;
} & GraphAILLMInputBase;
export declare const groqAgent: AgentFunction<GroqInputs & {
    model: string;
}, any, GroqInputs>;
declare const groqAgentInfo: AgentFunctionInfo;
export default groqAgentInfo;
