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

// just for gemini_agent
export type GraphAILlmMessage = {
  role: "user" | "system" | "assistant";
  content: string;
};

export const getMessages = <MessageType>(systemPrompt?: string, messages?: MessageType[]): MessageType[] => {
  const messagesCopy = [...(systemPrompt ? [{ role: "system" as const, content: systemPrompt } as MessageType] : []), ...(messages ?? [])];
  return messagesCopy;
};
