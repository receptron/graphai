import { AgentFunction } from "@/graphai";

export const totalAgent: AgentFunction = async ({ inputs }) => {
  return inputs.reduce((result, input) => {
    const inputArray = Array.isArray(input) ? input : [input];
    inputArray.forEach((innerInput) => {
      Object.keys(innerInput).forEach((key) => {
        const value = innerInput[key];
        if (result[key]) {
          result[key] += value;
        } else {
          result[key] = value;
        }
      });
    });
    return result;
  }, {});
};
