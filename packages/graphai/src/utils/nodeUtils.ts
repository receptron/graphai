import { parseNodeName } from "./utils";
import { DataSource } from "@/type";

export const inputs2dataSources = (inputs: string[], graphVersion: number) => {
  return inputs.reduce((tmp: Record<string, DataSource>, input: string) => {
    tmp[input] = parseNodeName(input, graphVersion);
    return tmp;
  }, {});
};

export const namedInputs2dataSources = (inputs: Record<string, any>, graphVersion: number) => {
  return Object.keys(inputs).reduce((tmp: Record<string, DataSource | DataSource[]>, key) => {
    const input = inputs[key];
    if (Array.isArray(input)) {
      tmp[key] = input.map((inp) => parseNodeName(inp, graphVersion));
    } else {
      tmp[key] = parseNodeName(input, graphVersion);
    }
    return tmp;
  }, {});
};
