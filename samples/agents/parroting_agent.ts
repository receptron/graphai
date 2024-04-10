import { AgentFunction } from "@/graphai";

export const parrotingAgent: AgentFunction = async (context) => {
  return context.params;
};
