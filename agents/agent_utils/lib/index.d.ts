import { AgentFunctionInfoSample, GraphData, DefaultInputData } from "graphai";
export declare const sample2GraphData: (sample: AgentFunctionInfoSample, agentName: string) => GraphData;
export declare const isNamedInputs: <NamedInput = DefaultInputData>(namedInputs: NamedInput) => boolean;
