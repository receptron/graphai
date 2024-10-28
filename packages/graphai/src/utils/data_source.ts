import { ResultData, DataSource, PropFunction } from "@/type";
import { isObject, isNull } from "./utils";
import { propFunctionRegex } from "./prop_function";

const getNestedData = (result: ResultData, propId: string, propFunction: PropFunction) => {
  const match = propId.match(propFunctionRegex);
  if (match) {
    return propFunction(result, propId);
  }

  // for array.
  if (Array.isArray(result)) {
    // $0, $1. array value.
    const regex = /^\$(\d+)$/;
    const match = propId.match(regex);
    if (match) {
      const index = parseInt(match[1], 10);
      return result[index];
    }
    if (propId === "$last") {
      return result[result.length - 1];
    }
  } else if (isObject(result)) {
    if (propId in result) {
      return result[propId];
    }
  }
  return undefined;
};

const innerGetDataFromSource = (result: ResultData, propIds: string[] | undefined, propFunction: PropFunction): ResultData | undefined => {
  if (!isNull(result) && propIds && propIds.length > 0) {
    const propId = propIds[0];
    const ret = getNestedData(result, propId, propFunction);
    if (ret === undefined) {
      console.error(`prop: ${propIds.join(".")} is not hit`);
    }
    if (propIds.length > 1) {
      return innerGetDataFromSource(ret, propIds.slice(1), propFunction);
    }
    return ret;
  }
  return result;
};

export const getDataFromSource = (result: ResultData | undefined, source: DataSource, propFunction: PropFunction): ResultData | undefined => {
  if (!source.nodeId) {
    return source.value;
  }
  return innerGetDataFromSource(result, source.propIds, propFunction);
};
