// valid
export type GraphAILLInputType = string | (string | undefined)[] | undefined;

export type GraphAILLMInputBase = {
  prompt?: GraphAILLInputType;
  system?: GraphAILLInputType;
  mergeablePrompts?: GraphAILLInputType;
  mergeableSystem?: GraphAILLInputType;
};

export type GraphAILLMStreamDataCreate = {
  type: "response.created";
  response: object;
};
export type GraphAILLMStreamDataProgress = {
  type: "response.in_progress";
  response: {
    output: {
      type: "text";
      text: string;
    }[];
  };
};

export type GraphAILLMStreamDataToolsProgress = {
  type: "response.in_progress";
  response: {
    output: {
      data: {
        id?: string;
        type?: "tool_calls";
        function: {
          arguments: string;
          name: string;
        };
        index: number;
      }[];
    }[];
  };
};

export type GraphAILLMStreamDataCompleted = {
  type: "response.completed";
  response: object;
};

export type GraphAILLMStreamData =
  | GraphAILLMStreamDataCreate
  | GraphAILLMStreamDataProgress
  | GraphAILLMStreamDataCompleted
  | GraphAILLMStreamDataToolsProgress;

export type LLMMetaResponse = {
  timing: {
    start: string;
    firstToken?: string;
    end: string;
    latencyToFirstToken?: number;
    duration?: number;
    totalElapsed: number;
  };
};

export type LLMMetaData = {
  timing: {
    start: number;
    firstToken?: number;
    end: number;
    latencyToFirstToken?: number;
    duration?: number;
    totalElapsed: number;
  };
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

//
export const convertMeta = (llmMetaData: LLMMetaData): LLMMetaResponse => {
  const { start, firstToken, end } = llmMetaData.timing;
  const latencyToFirstToken = firstToken ? firstToken - start : undefined;
  const duration = firstToken ? end - firstToken : undefined;
  const totalElapsed = end - start;

  return {
    timing: {
      start: new Date(start).toISOString(),
      firstToken: firstToken ? new Date(firstToken).toISOString() : undefined,
      end: new Date(end).toISOString(),
      latencyToFirstToken,
      duration,
      totalElapsed,
    },
  };
};

export const initLLMMetaData = () => {
  const llmMetaData: LLMMetaData = { timing: { start: Date.now(), end: 0, totalElapsed: 0 } };
  return llmMetaData;
};

export const llmMetaDataEndTime = (llmMetaData: LLMMetaData) => {
  llmMetaData.timing.end = Date.now();
};
export const llmMetaDataFirstTokenTime = (llmMetaData: LLMMetaData) => {
  if (llmMetaData.timing.firstToken === undefined) {
    llmMetaData.timing.firstToken = Date.now();
  }
};
