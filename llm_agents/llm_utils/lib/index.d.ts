export type GraphAILLInputType = string | (string | undefined)[] | undefined;
export type GraphAILLMInputBase = {
    prompt?: GraphAILLInputType;
    system?: GraphAILLInputType;
    mergeablePrompts?: GraphAILLInputType;
    mergeableSystem?: GraphAILLInputType;
};
export declare const flatString: (input: GraphAILLInputType) => string;
export declare const getMergeValue: (namedInputs: GraphAILLMInputBase, params: GraphAILLMInputBase, key: "mergeablePrompts" | "mergeableSystem", values: GraphAILLInputType) => string;
export type GraphAILlmMessage = {
    role: "user" | "system" | "assistant";
    content: string;
};
export declare const getMessages: <MessageType>(systemPrompt?: string, messages?: MessageType[]) => MessageType[];
