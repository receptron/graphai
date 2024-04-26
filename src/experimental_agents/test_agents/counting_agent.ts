import { AgentFunction } from "@/graphai";

export const countingAgent: AgentFunction = async ({ params }) => {
  return {
    list: new Array(params.count).fill(undefined).map((_, i) => {
      return i
    }),
  };
};
