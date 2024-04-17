import { AgentFunction } from "@/graphai";
import deepmerge from "deepmerge";

export const pushAgent: AgentFunction<Record<string, any>, Record<string, any>, Record<string, any>> = async ({ inputs }) => {
  const [array, item] = deepmerge({ inputs }, {}).inputs;
  // TODO: Validation
  array.push(item);
  return array;
};

export const popAgent: AgentFunction<Record<string, any>, Record<string, any>, Record<string, any>> = async (context) => {
  const { inputs } = context;
  const [array] = deepmerge({ inputs }, {}).inputs;
  // TODO: Varidation
  const item = array.pop();
  return { array, item };
};

export const shiftAgent: AgentFunction<Record<string, any>, Record<string, any>, Record<string, any>> = async (context) => {
  const { inputs } = context;
  const [array] = deepmerge({ inputs }, {}).inputs;
  // TODO: Varidation
  const item = array.shift();
  return { array, item };
};
