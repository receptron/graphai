import { DataSource, ResultData } from "@/type";

export const sleep = async (milliseconds: number) => {
  return await new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const parseNodeName = (inputNodeId: string): DataSource => {
  const parts = inputNodeId.split(".");
  if (parts.length == 1) {
    return { nodeId: parts[0] };
  }
  return { nodeId: parts[0], propId: parts[1] };
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

export const getDataFromSource = (result: ResultData, source: DataSource) => {
  if (result && source.propId) {
    const regex = /^\$(\d+)$/;
    const match = source.propId.match(regex);
    if (match && Array.isArray(result)) {
      const index = parseInt(match[1], 10);
      return result[index];
    }
    assert(isObject(result), "result is not object.");
    return (result as Record<string, any>)[source.propId];
  }
  return result;
};

export const strIntentionalError = "Intentional Error for Debugging";
