import { DataSource, DataSourceType, NestedDataSource, DataSources, ResultDataSet, ResultData } from "./type";

import { GraphNodes } from "./node";

import { getDataFromSource, isNamedInputs } from "@/utils/utils";

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
