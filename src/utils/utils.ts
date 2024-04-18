import { DataSource } from "@/type";

export const sleep = async (milliseconds: number) => {
  return await new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const parseNodeName = (name: string): DataSource => {
  const parts = name.split(".");
  if (parts.length == 1) {
    return { nodeId: parts[0] };
  } else {
    return { nodeId: parts[0], propId: parts[1] };
  }
};
