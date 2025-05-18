import type { AgentFunctionContext, AgentFilterFunction } from "graphai";
export type StepRunnerAwaitFunction = (context: AgentFunctionContext, result: unknown) => Promise<void>;
export declare const stepRunnerGenerator: (awaitStep: StepRunnerAwaitFunction) => AgentFilterFunction;
