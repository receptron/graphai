import { AgentFunction } from "@/graphai";
import deepmerge from "deepmerge";

export const shiftAgent: AgentFunction<Record<string, any>, Record<string, any>, Record<string, any>> = async (context) => {
  const { inputs } = context;
  const [array] = deepmerge({ inputs }, {}).inputs;
  // TODO: Validation
  const item = array.shift();
  return { array, item };
};
