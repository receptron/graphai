import { parseNodeName, isObject } from "./utils";
import { DataSource } from "@/type";

export const namedInputs2dataSources = (inputs: any, graphVersion: number): DataSource[] => {
  if (Array.isArray(inputs)) {
    return inputs.map((inp) => namedInputs2dataSources(inp, graphVersion)).flat();
  }
  if (isObject(inputs)) {
    return Object.values(inputs)
      .map((input) => {
        return namedInputs2dataSources(input, graphVersion);
      })
      .flat();
  }
  if (typeof inputs === "string") {
    const templateMatch = [...inputs.matchAll(/\${(:[^}]+)}/g)].map((m) => m[1]);
    if (templateMatch.length > 0) {
      return namedInputs2dataSources(templateMatch, graphVersion);
    }
  }

  return parseNodeName(inputs, graphVersion) as any;
};

export const dataSourceNodeIds = (sources: DataSource[]): string[] => {
  return sources.filter((source: DataSource) => source.nodeId).map((source) => source.nodeId!);
};
