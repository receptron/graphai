export type GrapAILLInputType = string | (string | undefined)[] | undefined;
export type GrapAILLMInputBase = {
    prompt?: GrapAILLInputType;
    system?: GrapAILLInputType;
    mergeablePrompts?: GrapAILLInputType;
    mergeableSystem?: GrapAILLInputType;
};
export declare const flatString: (input: GrapAILLInputType) => string;
export declare const getMergeValue: (namedInputs: GrapAILLMInputBase, params: GrapAILLMInputBase, key: "mergeablePrompts" | "mergeableSystem", values: GrapAILLInputType) => string;
type GraphAILlmMessageRole = "user" | "system" | "assistant";
export type GraphAILlmMessage = {
    role: GraphAILlmMessageRole;
    content: string | string[] | Record<string, unknown>[];
};
export declare const getMessages: (systemPrompt?: string, messages?: GraphAILlmMessage[]) => GraphAILlmMessage[];
export {};
