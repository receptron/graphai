import { AgentFunction } from "@/graphai";

export const copy2ArrayAgent: AgentFunction = async ({ inputs }) => {
  return new Array(10).fill(undefined).map(() => {
    return inputs[0];
  });
};
