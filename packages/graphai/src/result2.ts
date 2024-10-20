import { DataSource, DataSourceType, NestedDataSource, DataSources, ResultDataSet, ResultData } from "./type";

import { GraphNodes } from "./node";

import { parseNodeName, getDataFromSource, isNamedInputs, isObject, isNull } from "@/utils/utils";

const nestedParseNodeName = (input: any, nodes: GraphNodes, graphVersion: number): ResultData => {
  if (Array.isArray(input)) {
    return input.map((inp) => nestedParseNodeName(inp, nodes, graphVersion));
  }
  if (isNamedInputs(input)) {
    return resultsOf2(input, nodes, graphVersion) as unknown as DataSources;
  }
  if (typeof input === "string") {
    const templateMatch = [...input.matchAll(/\${(:[^}]+)}/g)].map((m) => m[1]);
    if (templateMatch.length > 0) {
      const results = nestedParseNodeName(templateMatch, nodes, graphVersion);
      return Array.from(templateMatch.keys()).reduce((tmp, key) => {
        return tmp.replaceAll("${" + templateMatch[key] + "}", (results as any)[key]);
      }, input);
    }
  }
  const dataSource = parseNodeName(input, graphVersion);
  return resultOf(dataSource, nodes);
};

export const resultsOf2 = (inputs: Record<string, any>, nodes: GraphNodes, graphVersion: number) => {
  return Object.keys(inputs).reduce((tmp: Record<string, ResultData>, key) => {
    const input = inputs[key];
    tmp[key] = isNamedInputs(input) ? resultsOf2(input, nodes, graphVersion) : nestedParseNodeName(input, nodes, graphVersion);
    return tmp;
  }, {});
};

export const resultOf = (source: DataSource, nodes: GraphNodes) => {
  const { result } = source.nodeId ? nodes[source.nodeId] : { result: undefined };
  return getDataFromSource(result, source);
};
