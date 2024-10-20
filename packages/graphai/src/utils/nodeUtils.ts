import { parseNodeName, isNamedInputs, isObject } from "./utils";
import { DataSource, DataSources, NestedDataSource } from "@/type";

export const inputs2dataSources = (inputs: string[], graphVersion: number) => {
  return inputs.reduce((tmp: Record<string, DataSource>, input: string) => {
    tmp[input] = parseNodeName(input, graphVersion);
    return tmp;
  }, {});
};

export const namedInputs2dataSources = (inputs: any, graphVersion: number): NestedDataSource[] => {
  if (Array.isArray(inputs)) {
    return inputs.map((inp) => namedInputs2dataSources(inp, graphVersion)).flat();
  }
  if (isObject(inputs)) {
    return Object.values(inputs).map((input) => {
      return namedInputs2dataSources(input, graphVersion);
    }).flat();
  }
  if (typeof inputs === "string") {
    const templateMatch = [...inputs.matchAll(/\${(:[^}]+)}/g)].map((m) => m[1]);
    if (templateMatch.length > 0) {
      return namedInputs2dataSources(templateMatch, graphVersion);
    }
  }

  return parseNodeName(inputs, graphVersion);
};

export const flatDataSourceNodeIds = (sources: (DataSource | DataSources | NestedDataSource)[]): string[] => {
  return flatDataSource(sources)
    .filter((source: DataSource) => source.nodeId)
    .map((source) => source.nodeId!);
};

export const flatDataSource = (sources: (DataSource | DataSources | NestedDataSource)[]): DataSource[] => {
  if (Array.isArray(sources)) {
    return sources.map((source) => flatDataSource(source as unknown as DataSource[])).flat(10);
  }
  if (isObject(sources)) {
    if ("__type" in sources) {
      return sources as any;
    }
    return flatDataSource(Object.values(sources));
  }
  return sources;
};
