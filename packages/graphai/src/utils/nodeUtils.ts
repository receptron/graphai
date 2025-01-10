import { parseNodeName, isObject } from "./utils";
import { DataSource } from "../type";

// for dataSource
export const inputs2dataSources = (inputs: any): DataSource[] => {
  if (Array.isArray(inputs)) {
    return inputs.map((inp) => inputs2dataSources(inp)).flat();
  }
  if (isObject(inputs)) {
    return Object.values(inputs)
      .map((input) => inputs2dataSources(input))
      .flat();
  }
  if (typeof inputs === "string") {
    const templateMatch = [...inputs.matchAll(/\${(:[^}]+)}/g)].map((m) => m[1]);
    if (templateMatch.length > 0) {
      return inputs2dataSources(templateMatch);
    }
  }

  return parseNodeName(inputs) as any;
};

export const dataSourceNodeIds = (sources: DataSource[]): string[] => {
  return sources.filter((source: DataSource) => source.nodeId).map((source) => source.nodeId!);
};
