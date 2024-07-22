export type GrapAILLInputType = string | (string | undefined)[] | undefined;

export type GrapAILLMInputBase = {
  prompt?: GrapAILLInputType;
  system?: GrapAILLInputType;
  mergeablePrompts?: GrapAILLInputType;
  mergeableSystem?: GrapAILLInputType;
};

export const flatString = (input: GrapAILLInputType) => {
  return Array.isArray(input) ? input.filter((a) => a).join("\n") : (input ?? "");
};

export const getMergeValue = (namedInputs: GrapAILLMInputBase, params: GrapAILLMInputBase, key: "mergeablePrompts" | "mergeableSystem", values: GrapAILLInputType) => {
  const inputValue = namedInputs[key];
  const paramsValue = params[key];

  return inputValue || paramsValue ? [flatString(inputValue), flatString(paramsValue)].filter((a) => a).join("\n") : flatString(values);
};
