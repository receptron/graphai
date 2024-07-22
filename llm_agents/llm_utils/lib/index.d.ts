export type GrapAILLInputType = string | (string | undefined)[] | undefined;
export type GrapAILLMInputBase = {
    prompt?: GrapAILLInputType;
    system?: GrapAILLInputType;
    mergeablePrompts?: GrapAILLInputType;
    mergeableSystem?: GrapAILLInputType;
};
export declare const flatString: (input: GrapAILLInputType) => string;
export declare const getMergeValue: (namedInputs: GrapAILLMInputBase, params: GrapAILLMInputBase, key: "mergeablePrompts" | "mergeableSystem", values: GrapAILLInputType) => string;
