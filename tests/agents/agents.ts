import { AgentFunction } from "@/graphai";

export const bypassAgent: AgentFunction<{}> = async (context) => {
  if (context.inputs.length === 1) {
    return context.inputs[0];
  }
  return context.inputs;
};
export const echoAgent: AgentFunction<{}> = async ({ params }) => {
  return params;
};
export const echoForkIndexAgent: AgentFunction<{}> = async ({ forkIndex }) => {
  return { forkIndex };
};
