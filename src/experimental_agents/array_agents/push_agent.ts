import { AgentFunction } from "@/graphai";
import deepmerge from "deepmerge";

export const pushAgent: AgentFunction<Record<string, any>, Record<string, any>, Record<string, any>> = async ({ inputs }) => {
  const [array, item] = deepmerge({ inputs }, {}).inputs;
  // TODO: Validation
  array.push(item);
  return array;
};
