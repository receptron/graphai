import { DataSource, ResultData, DefaultResultData } from "@/type";

export const sleep = async (milliseconds: number) => {
  return await new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const parseNodeName = (inputNodeId: string): DataSource => {
  const parts = inputNodeId.split(".");
  if (parts.length == 1) {
    return { nodeId: parts[0] };
  }
  return { nodeId: parts[0], propIds: parts.slice(1) };
};

export function assert(condition: boolean, message: string, isWarn: boolean = false): asserts condition {
  if (!condition) {
    if (!isWarn) {
      throw new Error(message);
    }
    console.warn("warn: " + message);
  }
}

export const isObject = (x: unknown) => {
  return x !== null && typeof x === "object";
};

const __get_data = (result: ResultData, propId: string) => {
  const regex = /^\$(\d+)$/;
  const match = propId.match(regex);
  if (match && Array.isArray(result)) {
    const index = parseInt(match[1], 10);
    return result[index];
  }
  assert(isObject(result), "result is not object.");
  return (result as Record<string, any>)[propId];
};

export const getDataFromSource = (result: ResultData, propIds: string[] | undefined): ResultData | undefined => {
  if (result && propIds && propIds.length > 0) {
    const propId = propIds[0];
    const ret = __get_data(result, propId);
    if (propIds.length > 1) {
      return getDataFromSource(ret, propIds.slice(1));
    }
    return ret;
  }
  return result;
};

export const strIntentionalError = "Intentional Error for Debugging";
