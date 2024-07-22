export type InputType = string | (string | undefined)[] | undefined;
export type AIAPIInputBase = {
    prompt?: InputType;
    system?: InputType;
    mergeablePrompts?: InputType;
    mergeableSystem?: InputType;
};
export declare const getMergeValue: (namedInputs: AIAPIInputBase, params: AIAPIInputBase, key: "mergeablePrompts" | "mergeableSystem", values: InputType) => string;
