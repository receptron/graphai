import { AgentFunction } from "@/graphai";
import deepmerge from "deepmerge";

export const dataObjectMergeTemplateAgent: AgentFunction = async ({ inputs }) => {
  return inputs.reduce((tmp, input) => {
    return deepmerge(tmp, input);
  }, {});
};
