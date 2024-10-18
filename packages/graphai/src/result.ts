import { DataSource, DataSourceType, NestedDataSource, DataSources, ResultDataSet, ResultData } from "./type";

import { GraphNodes } from "./node";

import { getDataFromSource, isNamedInputs, isObject } from "@/utils/utils";

const nestedResultOf = (source: DataSource | NestedDataSource | DataSources, nodes: GraphNodes): ResultDataSet => {
  if (Array.isArray(source)) {
    return source.map((a) => {
      return nestedResultOf(a, nodes);
    });
  }
  if (isNamedInputs(source)) {
    if (source.__type === DataSourceType) {
      return resultOf(source as DataSource, nodes);
    }
    return Object.keys(source).reduce((tmp: Record<string, ResultDataSet>, key: string) => {
      tmp[key] = nestedResultOf((source as NestedDataSource)[key], nodes);
      return tmp;
    }, {});
  }
  return resultOf(source as DataSource, nodes);
};

export const resultsOf = (sources: NestedDataSource, nodes: GraphNodes) => {
  const ret: Record<string, ResultData | undefined> = {};
  Object.keys(sources).forEach((key) => {
    ret[key] = nestedResultOf(sources[key], nodes);
  });
  return ret;
};
export const resultOf = (source: DataSource, nodes: GraphNodes) => {
  const { result } = source.nodeId ? nodes[source.nodeId] : { result: undefined };
  return getDataFromSource(result, source);
};

// for anyInput
export const cleanResultInner = (results: ResultData): ResultData | null => {
  if (Array.isArray(results)) {
    const ret = results.map((result: ResultData) => cleanResultInner(result)).filter((result) => result);
    return ret.length === 0 ? null : ret;
  }

  if (isObject(results)) {
    const ret = Object.keys(results).reduce((tmp: Record<string, ResultData>, key: string) => {
      const value = cleanResultInner(results[key]);
      if (value !== null && value !== undefined) {
        tmp[key] = value;
      }
      return tmp;
    }, {});
    return Object.keys(ret).length === 0 ? null : ret;
  }

  return results;
};

export const cleanResult = (results: Record<string, ResultData | undefined>) => {
  return Object.keys(results).reduce((tmp: Record<string, ResultData | undefined>, key: string) => {
    if (results[key]) {
      const value = cleanResultInner(results[key]);
      if (value !== null && value !== undefined) {
        tmp[key] = value;
      }
    }
    return tmp;
  }, {});
};
