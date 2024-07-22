import { AgentFunction, AgentFunctionInfo } from "graphai";
type InputType = string | (string | undefined)[] | undefined;
type OpenAIInputs = {
    model?: string;
    prompt?: InputType;
    system?: InputType;
    mergeablePrompts?: InputType;
    mergeableSystem?: InputType;
    baseURL?: string;
    apiKey?: string;
    forWeb?: boolean;
};
export declare const flatString: (input: InputType) => string;
export declare const getMergeValue: (namedInputs: OpenAIInputs, params: OpenAIInputs, key: "mergeablePrompts" | "mergeableSystem", values: InputType) => string;
export declare const openAIImageAgent: AgentFunction<OpenAIInputs, Record<string, any> | string, string | Array<any>, OpenAIInputs>;
declare const openAIImageAgentInfo: AgentFunctionInfo;
export default openAIImageAgentInfo;
