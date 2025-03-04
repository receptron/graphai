import { AgentFunctionInfoSample, GraphData, DefaultInputData } from "graphai";
export * from "./type";
export declare const sample2GraphData: (sample: AgentFunctionInfoSample, agentName: string) => GraphData;
export declare const isNamedInputs: <NamedInput = DefaultInputData>(namedInputs: NamedInput) => boolean;
export declare const arrayValidate: (agentName: string, namedInputs: {
    array: Array<unknown>;
}, extra_message?: string) => void;
export declare const isNull: (data: unknown) => data is null | undefined;
