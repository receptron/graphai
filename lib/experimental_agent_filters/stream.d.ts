import { AgentFilterFunction, AgentFunctionContext } from "../type";
export declare const streamAgentFilterGenerator: <T>(callback: (context: AgentFunctionContext, data: T) => void) => AgentFilterFunction;
