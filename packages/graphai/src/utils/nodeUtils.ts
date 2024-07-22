import { parseNodeName } from "./utils";
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
  return parseNodeName(input, graphVersion);
};

export const namedInputs2dataSources = (inputs: Record<string, any>, graphVersion: number) => {
  return Object.keys(inputs).reduce((tmp: NestedDataSource, key) => {
    const input = inputs[key];
    tmp[key] = nestedParseNodeName(input, graphVersion);
    return tmp;
  }, {});
};

export const flatDataSourceNodeIds = (sources: DataSource[] | DataSources[]): string[] => {
  return flatDataSource(sources).filter((source) => source.nodeId).map((source) => source.nodeId!);
}

export const flatDataSource = (sources: DataSource[] | DataSources[]): DataSource[] => {
  return sources
    .map((source) => {
      if (Array.isArray(source)) {
        return source
          .map((s) => {
            if (Array.isArray(s)) {
              return flatDataSource(s);
            }
            return s;
          })
          .flat();
      }
      return source;
    })
    .flat();
};
