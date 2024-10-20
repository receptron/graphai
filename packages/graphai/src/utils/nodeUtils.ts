import { parseNodeName, isNamedInputs, isObject } from "./utils";
import { DataSource, DataSources, NestedDataSource } from "@/type";

export const inputs2dataSources = (inputs: string[], graphVersion: number) => {
  return inputs.reduce((tmp: Record<string, DataSource>, input: string) => {
    tmp[input] = parseNodeName(input, graphVersion);
    return tmp;
  }, {});
};

const nestedParseNodeName = (input: any, graphVersion: number): DataSources => {
  if (Array.isArray(input)) {
    return input.map((inp) => nestedParseNodeName(inp, graphVersion));
  }
  if (isNamedInputs(input)) {
    return namedInputs2dataSources(input, graphVersion) as unknown as DataSources;
  }
  return parseNodeName(input, graphVersion);
};

export const namedInputs2dataSources = (inputs: Record<string, any>, graphVersion: number): NestedDataSource => {
  return Object.keys(inputs).reduce((tmp: NestedDataSource, key) => {
    const input = inputs[key];
    tmp[key] = isNamedInputs(input) ? namedInputs2dataSources(input, graphVersion) : nestedParseNodeName(input, graphVersion);
    return tmp;
  }, {});
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
