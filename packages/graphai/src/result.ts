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

export const cleanResultInner = (results: ResultData): ResultData => {
  if (Array.isArray(results)) {
    return results.filter((result) => result).map((result: ResultData) => cleanResultInner(result));
  }

  if (isObject(results)) {
    return Object.keys(results).reduce((tmp: Record<string, ResultData>, key: string) => {
      if (results[key]) {
        tmp[key] = cleanResultInner(results[key]);
      }
      return tmp;
    }, {});
  }

  return results;
};

export const cleanResult = (results: Record<string, ResultData | undefined>) => {
  return Object.keys(results).reduce((tmp: Record<string, ResultData | undefined>, key: string) => {
    if (results[key]) {
      tmp[key] = cleanResultInner(results[key]);
    }
    return tmp;
  }, {});
};
