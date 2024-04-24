import { AgentFunction } from "@/graphai";

export const echoForkIndexAgent: AgentFunction = async ({ debugInfo: { forkIndex } }) => {
  return { forkIndex };
};
