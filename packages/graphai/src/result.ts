import { DataSource, ResultData } from "./type";

import { GraphNodes } from "./node";

import { getDataFromSource, parseNodeName, isNamedInputs, isObject, isNull } from "@/utils/utils";

const nestedParseNodeName = (input: any, nodes: GraphNodes, graphVersion: number): ResultData => {
  if (Array.isArray(input)) {
    return input.map((inp) => nestedParseNodeName(inp, nodes, graphVersion));
  }
  if (isNamedInputs(input)) {
    return resultsOf(input, nodes, graphVersion);
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
  return resultOf(parseNodeName(input, graphVersion), nodes);
};

export const resultsOf = (inputs: Record<string, any> | Array<string>, nodes: GraphNodes, graphVersion: number) => {
  // for inputs. TODO remove if array input is not supported
  if (Array.isArray(inputs)) {
    return inputs.reduce((tmp: Record<string, ResultData>, key) => {
      tmp[key] = nestedParseNodeName(key, nodes, graphVersion);
      return tmp;
    }, {});
  }
  return Object.keys(inputs).reduce((tmp: Record<string, ResultData>, key) => {
    const input = inputs[key];
    tmp[key] = isNamedInputs(input) ? resultsOf(input, nodes, graphVersion) : nestedParseNodeName(input, nodes, graphVersion);
    return tmp;
  }, {});
};

export const resultOf = (source: DataSource, nodes: GraphNodes) => {
  const { result } = source.nodeId ? nodes[source.nodeId] : { result: undefined };
  return getDataFromSource(result, source);
};

// for anyInput
export const cleanResultInner = (results: ResultData): ResultData | null => {
  if (Array.isArray(results)) {
    return results.map((result: ResultData) => cleanResultInner(result)).filter((result) => !isNull(result));
  }

  if (isObject(results)) {
    return Object.keys(results).reduce((tmp: Record<string, ResultData>, key: string) => {
      const value = cleanResultInner(results[key]);
      if (!isNull(value)) {
        tmp[key] = value;
      }
      return tmp;
    }, {});
  }

  return results;
};

export const cleanResult = (results: Record<string, ResultData | undefined>) => {
  return Object.keys(results).reduce((tmp: Record<string, ResultData | undefined>, key: string) => {
    const value = cleanResultInner(results[key]);
    if (!isNull(value)) {
      tmp[key] = value;
    }
    return tmp;
  }, {});
};
