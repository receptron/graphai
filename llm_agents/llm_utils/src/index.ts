// typo (todo remove later)
export type GrapAILLInputType = string | (string | undefined)[] | undefined;

export type GrapAILLMInputBase = {
  prompt?: GrapAILLInputType;
  system?: GrapAILLInputType;
  mergeablePrompts?: GrapAILLInputType;
  mergeableSystem?: GrapAILLInputType;
};

// valid
export type GraphAILLInputType = string | (string | undefined)[] | undefined;

export type GraphAILLMInputBase = {
  prompt?: GraphAILLInputType;
  system?: GraphAILLInputType;
  mergeablePrompts?: GraphAILLInputType;
  mergeableSystem?: GraphAILLInputType;
};


export const flatString = (input: GraphAILLInputType): string => {
  return Array.isArray(input) ? input.filter((a) => a).join("\n") : (input ?? "");
};

export const getMergeValue = (
  namedInputs: GraphAILLMInputBase,
  params: GraphAILLMInputBase,
  key: "mergeablePrompts" | "mergeableSystem",
  values: GraphAILLInputType,
): string => {
  const inputValue = namedInputs[key];
  const paramsValue = params[key];

  return inputValue || paramsValue ? [flatString(inputValue), flatString(paramsValue)].filter((a) => a).join("\n") : flatString(values);
};

type GraphAILlmMessageRole = "user" | "system" | "assistant";

export type GraphAILlmMessage<GraphAILlmMessageContent = string | string[] | Record<string, unknown>> = {
  role: GraphAILlmMessageRole;
  content: GraphAILlmMessageContent;
};

export const getMessages = (systemPrompt?: string, messages?: GraphAILlmMessage[]): GraphAILlmMessage[] => {
  const messagesCopy = [...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []), ...(messages ?? [])];
  return messagesCopy;
};
