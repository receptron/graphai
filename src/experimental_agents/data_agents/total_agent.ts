import { AgentFunction } from "@/graphai";

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
