import Anthropic from "@anthropic-ai/sdk";
import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GraphAILLMInputBase, GraphAILLInputType } from "@graphai/llm_utils";
import type { GraphAIText, GraphAITool, GraphAIToolCalls, GraphAIMessage, GraphAIMessages } from "@graphai/agent_utils";
type AnthropicInputs = {
    verbose?: boolean;
    model?: string;
    temperature?: number;
    max_tokens?: number;
    tools?: any[];
    tool_choice?: any;
    messages?: Array<Anthropic.MessageParam>;
    response_format?: any;
} & GraphAILLMInputBase;
type AnthropicConfig = {
    apiKey?: string;
    stream?: boolean;
    dataStream?: boolean;
    forWeb?: boolean;
};
type AnthropicParams = AnthropicInputs & AnthropicConfig;
type AnthropicResult = Partial<GraphAIText & GraphAITool & GraphAIToolCalls & GraphAIMessage<string | Anthropic.ContentBlockParam[]> & GraphAIMessages<string | Anthropic.ContentBlockParam[]>>;
type Response = Anthropic.Message & {
    _request_id?: string | null | undefined;
};
export declare const anthoropicTool2OpenAITool: (response: Response) => {
    role: "assistant";
    content: string;
    tool_calls: {
        id: string;
        type: string;
        function: {
            name: string;
            arguments: string;
        };
    }[];
} | {
    role: "assistant";
    content: string;
    tool_calls?: undefined;
};
export declare const system_with_response_format: (system: GraphAILLInputType, response_format?: any) => GraphAILLInputType;
export declare const convOpenAIToolsToAnthropicToolMessage: (messages: any[]) => any[];
export declare const anthropicAgent: AgentFunction<AnthropicParams, AnthropicResult, AnthropicInputs, AnthropicConfig>;
declare const anthropicAgentInfo: AgentFunctionInfo;
export default anthropicAgentInfo;
