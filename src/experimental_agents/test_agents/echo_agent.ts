import { AgentFunction } from "@/graphai";

export const echoAgent: AgentFunction = async ({ params }) => {
  return params;
};
