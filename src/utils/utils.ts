import { DataSource } from "@/type";

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

export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export const isObject = (x: unknown) => {
  return x !== null && typeof x === 'object'
}
