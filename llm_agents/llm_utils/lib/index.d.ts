export type GrapAILLInputType = string | (string | undefined)[] | undefined;
export type GrapAILLMInputBase = {
    prompt?: GrapAILLInputType;
    system?: GrapAILLInputType;
    mergeablePrompts?: GrapAILLInputType;
    mergeableSystem?: GrapAILLInputType;
};
export type GraphAILLInputType = string | (string | undefined)[] | undefined;
export type GraphAILLMInputBase = {
    prompt?: GraphAILLInputType;
    system?: GraphAILLInputType;
    mergeablePrompts?: GraphAILLInputType;
    mergeableSystem?: GraphAILLInputType;
};
export declare const flatString: (input: GraphAILLInputType) => string;
export declare const getMergeValue: (namedInputs: GraphAILLMInputBase, params: GraphAILLMInputBase, key: "mergeablePrompts" | "mergeableSystem", values: GraphAILLInputType) => string;
type GraphAILlmMessageRole = "user" | "system" | "assistant";
type GraphAILlmMessageContent = string | string[] | Record<string, unknown>;
export type GraphAILlmMessage<ContetType = GraphAILlmMessageContent> = {
    role: GraphAILlmMessageRole;
    content: ContetType;
};
export declare const getMessages: <ContetType = GraphAILlmMessageContent>(systemPrompt?: string, messages?: GraphAILlmMessage<ContetType>[]) => GraphAILlmMessage<ContetType>[];
export declare const getMessages2: <MessageType>(systemPrompt?: string, messages?: MessageType[]) => MessageType[];
export {};
