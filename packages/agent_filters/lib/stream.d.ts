import { AgentFilterFunction, AgentFunctionContext } from "graphai";
export declare const streamAgentFilterGenerator: <T>(callback: (context: AgentFunctionContext, data: T) => void) => AgentFilterFunction;
