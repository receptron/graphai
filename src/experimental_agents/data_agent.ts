import { AgentFunction } from "@/graphai";
import deepmerge from "deepmerge";

export const dataObjectMergeTemplateAgent: AgentFunction = async ({ inputs, debugInfo: { verbose } }) => {
  if (verbose) {
    // console.log("executing", nodeId, params);
  }
  return inputs.reduce((tmp, input) => {
    return deepmerge(tmp, input);
  }, {});
};

export const dataSumTemplateAgent: AgentFunction<Record<string, any>, number, number> = async ({ inputs, debugInfo: { verbose } }) => {
  if (verbose) {
    // console.log("executing", nodeId, params);
  }
  return inputs.reduce((tmp, input) => {
    return tmp + input;
  }, 0);
};

export const totalAgent: AgentFunction = async ({ inputs }) => {
  return inputs.reduce((result, input) => {
    Object.keys(input).forEach((key) => {
      const value = input[key];
      if (result[key]) {
        result[key] += value;
      } else {
        result[key] = value;
      }
    });
    return result;
  }, {});
};
