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
            type: "tool_calls";
            data: {
                id?: string;
                type: "function";
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
export type GraphAILLMStreamData = GraphAILLMStreamDataCreate | GraphAILLMStreamDataProgress | GraphAILLMStreamDataCompleted | GraphAILLMStreamDataToolsProgress;
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
export declare const flatString: (input: GraphAILLInputType) => string;
export declare const getMergeValue: (namedInputs: GraphAILLMInputBase, params: GraphAILLMInputBase, key: "mergeablePrompts" | "mergeableSystem", values: GraphAILLInputType) => string;
export type GraphAILlmMessage = {
    role: "user" | "system" | "assistant";
    content: string;
};
export declare const getMessages: <MessageType>(systemPrompt?: string, messages?: MessageType[]) => MessageType[];
export declare const convertMeta: (llmMetaData: LLMMetaData) => LLMMetaResponse;
export declare const initLLMMetaData: () => LLMMetaData;
export declare const llmMetaDataEndTime: (llmMetaData: LLMMetaData) => void;
export declare const llmMetaDataFirstTokenTime: (llmMetaData: LLMMetaData) => void;
