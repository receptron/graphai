export type InputType = string | (string | undefined)[] | undefined;

export type AIAPIInputBase = {
  prompt?: InputType;
  system?: InputType;
  mergeablePrompts?: InputType;
  mergeableSystem?: InputType;
};

const flatString = (input: InputType) => {
  return Array.isArray(input) ? input.filter((a) => a).join("\n") : input ?? "";
};

export const getMergeValue = (namedInputs: AIAPIInputBase, params: AIAPIInputBase, key: "mergeablePrompts" | "mergeableSystem", values: InputType) => {
  const inputValue = namedInputs[key];
  const paramsValue = params[key];

  return inputValue || paramsValue ? [flatString(inputValue), flatString(paramsValue)].filter((a) => a).join("\n") : flatString(values);
};
