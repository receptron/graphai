import { AgentFunction } from "@/graphai";

export const bypassAgent: AgentFunction = async (context) => {
  if (context.inputs.length === 1) {
    return context.inputs[0];
  }
  return context.inputs;
};
