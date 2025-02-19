import { DataSource, ResultData, PropFunction } from "../type";

import { GraphNodes } from "../node";

import { parseNodeName, isNamedInputs, isObject, isNull } from "./utils";
import { getDataFromSource } from "./data_source";

const resultsOfInner = (input: any, nodes: GraphNodes, propFunctions: PropFunction[], isSelfNode: boolean = false): ResultData => {
  if (Array.isArray(input)) {
    return input.map((inp) => resultsOfInner(inp, nodes, propFunctions, isSelfNode));
  }
  if (isNamedInputs(input)) {
    return resultsOf(input, nodes, propFunctions, isSelfNode);
  }
  if (typeof input === "string") {
    const templateMatch = [...input.matchAll(/\${(:[^}]+)}/g)].map((m) => m[1]);
    if (templateMatch.length > 0) {
      const results = resultsOfInner(templateMatch, nodes, propFunctions, isSelfNode);
      return Array.from(templateMatch.keys()).reduce((tmp, key) => {
        return tmp.replaceAll("${" + templateMatch[key] + "}", (results as any)[key]);
      }, input);
    }
  }
  return resultOf(parseNodeName(input, isSelfNode), nodes, propFunctions);
};

export const resultsOf = (inputs: Record<string, any>, nodes: GraphNodes, propFunctions: PropFunction[], isSelfNode: boolean = false) => {
  return Object.keys(inputs).reduce((tmp: Record<string, ResultData>, key) => {
    const input = inputs[key];
    tmp[key] = isNamedInputs(input) ? resultsOf(input, nodes, propFunctions, isSelfNode) : resultsOfInner(input, nodes, propFunctions, isSelfNode);
    return tmp;
  }, {});
};

export const resultOf = (source: DataSource, nodes: GraphNodes, propFunctions: PropFunction[]) => {
  const { result } = source.nodeId ? nodes[source.nodeId] : { result: undefined };
  return getDataFromSource(result, source, propFunctions);
};

// clean up object for anyInput
export const cleanResultInner = (results: ResultData): ResultData | null => {
  if (Array.isArray(results)) {
    return results.map((result: ResultData) => cleanResultInner(result)).filter((result) => !isNull(result));
  }

  if (isObject<ResultData>(results)) {
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
