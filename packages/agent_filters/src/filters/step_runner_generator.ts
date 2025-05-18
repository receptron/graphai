import type { AgentFunctionContext, AgentFilterFunction } from "graphai";

export type StepRunnerAwaitFunction = (context: AgentFunctionContext, result: unknown) => Promise<void>;

export const stepRunnerGenerator = (awaitStep: StepRunnerAwaitFunction) => {
  const stepRunnerFilter: AgentFilterFunction = async (context, next) => {
    const result = await next(context);
    await awaitStep(context, result);
    return result;
  };
  return stepRunnerFilter;
};
