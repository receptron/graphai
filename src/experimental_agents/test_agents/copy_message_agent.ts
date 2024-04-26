import { AgentFunction } from "@/graphai";

export const copyMessageAgent: AgentFunction = async ({ params }) => {
  return {messages: new Array(params.count).fill(undefined).map((_, i) => { return params.message })};
};
