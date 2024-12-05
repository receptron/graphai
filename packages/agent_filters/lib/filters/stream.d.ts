import { AgentFunctionContext } from "graphai";
export declare const streamAgentFilterGenerator: <T>(callback: (context: AgentFunctionContext, data: T) => void) => (context: AgentFunctionContext<import("graphai").DefaultParamsType, import("graphai").DefaultInputData>, agent: import("graphai").AgentFunction) => Promise<import("graphai").ResultData<import("graphai").DefaultResultData>>;
